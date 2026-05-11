import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre_completo, correo_electronico, contrasena, telefono, documento_identificacion, direccion } = body;

    if (!nombre_completo || !correo_electronico || !contrasena) {
      return NextResponse.json({ error: 'Nombre, correo y contraseña son requeridos' }, { status: 400 });
    }

    const existe = await withPrismaRetry(prisma =>
      prisma.usuario.findUnique({ where: { correo_electronico } })
    );
    if (existe) return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 400 });

    const rolEstandar = await withPrismaRetry(prisma =>
      prisma.rol.findFirst({ where: { nombre: { contains: 'Est' } } })
    );
    const id_rol = rolEstandar?.id_rol ?? 5;

    const cliente = await withPrismaRetry(prisma =>
      prisma.cliente.create({
        data: {
          numero_cliente: `CLI-${Date.now()}`,
          telefono: telefono || '',
          documento_identificacion: documento_identificacion || '',
          direccion: direccion || '',
          fecha_registro: new Date(),
          Usuario: {
            create: {
              nombre_completo, correo_electronico, contrasena_hash: contrasena,
              activo: true, id_rol,
            },
          },
        },
        include: { Usuario: { include: { Rol: true } } },
      })
    );

    const sessionData = {
      id_usuario: cliente.Usuario.id_usuario,
      nombre_completo: cliente.Usuario.nombre_completo,
      correo_electronico: cliente.Usuario.correo_electronico,
      id_rol: cliente.Usuario.id_rol,
      rol_nombre: cliente.Usuario.Rol.nombre,
      es_empleado: false,
      id_cliente: cliente.id_cliente,
      tipo_cliente: 'ESTANDAR',
    };

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/',
    });

    return NextResponse.json({ usuario: sessionData }, { status: 201 });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: 'Error al registrar cuenta' }, { status: 500 });
  }
}
