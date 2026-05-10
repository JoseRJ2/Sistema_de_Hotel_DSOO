import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await withPrismaRetry(prisma =>
      prisma.cliente.findMany({
        include: {
          Usuario: { include: { Rol: true } },
          Membresia: { orderBy: { id_membresia: 'desc' }, take: 1 },
        },
        orderBy: { id_cliente: 'asc' },
      })
    );
    return NextResponse.json(clientes);
  } catch {
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre_completo, correo_electronico, telefono, documento_identificacion, direccion } = body;

    const existe = await withPrismaRetry(prisma =>
      prisma.usuario.findUnique({ where: { correo_electronico } })
    );
    if (existe) return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });

    const rolEstandar = await withPrismaRetry(prisma =>
      prisma.rol.findFirst({ where: { nombre: { contains: 'Est' } } })
    );
    const id_rol = rolEstandar?.id_rol ?? 5;

    const numero_cliente = `CLI-${Date.now()}`;

    const cliente = await withPrismaRetry(prisma =>
      prisma.cliente.create({
        data: {
          numero_cliente,
          telefono,
          documento_identificacion,
          direccion,
          fecha_registro: new Date(),
          Usuario: {
            create: {
              nombre_completo,
              correo_electronico,
              contrasena_hash: 'temporal123',
              activo: true,
              id_rol,
            },
          },
        },
        include: { Usuario: true },
      })
    );

    await withPrismaRetry(prisma =>
      prisma.registroAuditoria.create({
        data: {
          accion: 'REGISTRAR_CLIENTE',
          entidad_afectada: 'Cliente',
          id_entidad: cliente.id_cliente,
          descripcion: `Cliente ${nombre_completo} registrado`,
          ip_origen: '127.0.0.1',
          fecha_hora: new Date(),
        },
      })
    );

    return NextResponse.json(cliente, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al registrar cliente' }, { status: 500 });
  }
}
