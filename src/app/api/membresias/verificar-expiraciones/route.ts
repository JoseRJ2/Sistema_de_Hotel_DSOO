import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function POST() {
  try {
    const vencidas = await withPrismaRetry(prisma =>
      prisma.membresia.findMany({
        where: { estado: 'ACTIVA', fecha_fin: { lt: new Date() } },
        include: { Cliente: true },
      })
    );

    for (const mem of vencidas) {
      await withPrismaRetry(prisma =>
        prisma.membresia.update({
          where: { id_membresia: mem.id_membresia },
          data: { estado: 'VENCIDA' },
        })
      );

      const rolEstandar = await withPrismaRetry(prisma =>
        prisma.rol.findFirst({ where: { nombre: { contains: 'Est' } } })
      );
      if (rolEstandar) {
        await withPrismaRetry(prisma =>
          prisma.usuario.update({
            where: { id_usuario: mem.Cliente.id_usuario },
            data: { id_rol: rolEstandar.id_rol },
          })
        );
      }

      await withPrismaRetry(prisma =>
        prisma.registroAuditoria.create({
          data: {
            accion: 'EXPIRACION_MEMBRESIA',
            entidad_afectada: 'Membresia',
            id_entidad: mem.id_membresia,
            descripcion: 'Membresía vencida, cliente degradado a ESTÁNDAR',
            ip_origen: 'sistema',
            fecha_hora: new Date(),
          },
        })
      );
    }

    return NextResponse.json({ vencidas: vencidas.length });
  } catch {
    return NextResponse.json({ error: 'Error al verificar expiraciones' }, { status: 500 });
  }
}
