import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const body = await req.json();
    const { accion, id_rol } = body;

    const usuario = await withPrismaRetry(prisma =>
      prisma.usuario.findUnique({ where: { id_usuario: id } })
    );
    if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    if (accion === 'DESACTIVAR') {
      const adminsActivos = await withPrismaRetry(prisma =>
        prisma.usuario.count({ where: { id_rol: 1, activo: true } })
      );
      if (usuario.id_rol === 1 && adminsActivos <= 1) {
        return NextResponse.json({ error: 'No se puede desactivar el último administrador' }, { status: 400 });
      }

      const actualizado = await withPrismaRetry(prisma =>
        prisma.usuario.update({ where: { id_usuario: id }, data: { activo: false } })
      );

      await withPrismaRetry(prisma =>
        prisma.registroAuditoria.create({
          data: {
            accion: 'DESACTIVAR_USUARIO',
            entidad_afectada: 'Usuario',
            id_entidad: id,
            descripcion: `Usuario ${usuario.nombre_completo} desactivado`,
            ip_origen: '127.0.0.1',
            fecha_hora: new Date(),
          },
        })
      );
      return NextResponse.json(actualizado);
    }

    if (accion === 'MODIFICAR_ROL') {
      const actualizado = await withPrismaRetry(prisma =>
        prisma.usuario.update({ where: { id_usuario: id }, data: { id_rol: Number(id_rol) } })
      );

      await withPrismaRetry(prisma =>
        prisma.registroAuditoria.create({
          data: {
            accion: 'MODIFICAR_ROL',
            entidad_afectada: 'Usuario',
            id_entidad: id,
            descripcion: `Rol actualizado a id_rol=${id_rol}`,
            ip_origen: '127.0.0.1',
            fecha_hora: new Date(),
          },
        })
      );
      return NextResponse.json(actualizado);
    }

    if (accion === 'ELIMINAR') {
      const adminsActivos = await withPrismaRetry(prisma =>
        prisma.usuario.count({ where: { id_rol: 1, activo: true } })
      );
      if (usuario.id_rol === 1 && adminsActivos <= 1) {
        return NextResponse.json({ error: 'No se puede eliminar el último administrador' }, { status: 400 });
      }

      await withPrismaRetry(prisma => prisma.cliente.deleteMany({ where: { id_usuario: id } }));
      await withPrismaRetry(prisma => prisma.notificacion.deleteMany({ where: { id_usuario: id } }));
      await withPrismaRetry(prisma => prisma.usuario.delete({ where: { id_usuario: id } }));

      await withPrismaRetry(prisma =>
        prisma.registroAuditoria.create({
          data: {
            accion: 'ELIMINAR_USUARIO', entidad_afectada: 'Usuario', id_entidad: id,
            descripcion: `Usuario ${usuario.nombre_completo} eliminado permanentemente`,
            ip_origen: '127.0.0.1', fecha_hora: new Date(),
          },
        })
      );
      return NextResponse.json({ ok: true, mensaje: 'Usuario eliminado' });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}
