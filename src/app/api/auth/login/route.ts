import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { correo_electronico, contrasena } = body;

    if (!correo_electronico || !contrasena) {
      return NextResponse.json(
        { error: 'Correo y contrasena son requeridos' },
        { status: 400 }
      );
    }

    const usuario = await withPrismaRetry((prisma) =>
      prisma.usuario.findUnique({
        where: { correo_electronico },
        include: { Rol: true, Cliente: true },
      })
    );

    if (!usuario) {
      return NextResponse.json(
        { error: 'Correo o contrasena incorrectos' },
        { status: 401 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Esta cuenta ha sido desactivada' },
        { status: 403 }
      );
    }

    if (usuario.contrasena_hash !== contrasena) {
      return NextResponse.json(
        { error: 'Correo o contrasena incorrectos' },
        { status: 401 }
      );
    }

    const rolNombre = usuario.Rol.nombre.toUpperCase();

    // Regla robusta: si tiene registro en Cliente, es cliente.
    // No depende del texto/acento del rol.
    const esEmpleado = !usuario.Cliente;

    const sessionData = {
      id_usuario: usuario.id_usuario,
      nombre_completo: usuario.nombre_completo,
      correo_electronico: usuario.correo_electronico,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.Rol.nombre,
      es_empleado: esEmpleado,
      id_cliente: usuario.Cliente?.id_cliente ?? null,
      tipo_cliente: esEmpleado
        ? null
        : rolNombre.includes('VIP')
          ? 'VIP'
          : rolNombre.includes('PREMIUM')
            ? 'PREMIUM'
            : 'ESTANDAR',
    };

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ usuario: sessionData });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
