import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const usuarios = await withPrismaRetry(prisma =>
      prisma.usuario.findMany({
        include: { Rol: true },
        orderBy: { id_usuario: 'asc' },
      })
    );
    return NextResponse.json(usuarios);
  } catch {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre_completo, correo_electronico, contrasena_hash, id_rol } = body;

    const existe = await withPrismaRetry(prisma =>
      prisma.usuario.findUnique({ where: { correo_electronico } })
    );
    if (existe) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }

    const usuario = await withPrismaRetry(prisma =>
      prisma.usuario.create({
        data: { nombre_completo, correo_electronico, contrasena_hash, id_rol: Number(id_rol), activo: true },
      })
    );

    await withPrismaRetry(prisma =>
      prisma.registroAuditoria.create({
        data: {
          accion: 'CREAR_USUARIO',
          entidad_afectada: 'Usuario',
          id_entidad: usuario.id_usuario,
          descripcion: `Usuario ${nombre_completo} creado`,
          ip_origen: '127.0.0.1',
          fecha_hora: new Date(),
        },
      })
    );

    return NextResponse.json(usuario, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
