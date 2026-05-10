import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    const reserva = await withPrismaRetry(prisma =>
      prisma.reserva.findUnique({
        where: { id_reserva: id },
        include: { Cliente: { include: { Usuario: { include: { Rol: true } } } } },
      })
    );
    if (!reserva) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });

    const tipoCliente = reserva.Cliente?.Usuario?.Rol?.nombre?.toUpperCase() ?? 'ESTANDAR';
    const horasRestantes = (new Date(reserva.fecha_check_in).getTime() - Date.now()) / 3600000;

    let penalizacion = 0;
    if (tipoCliente.includes('ESTANDAR') && horasRestantes < 48) penalizacion = Number(reserva.costo_total) * 0.5;
    if (tipoCliente.includes('PREMIUM') && horasRestantes < 24) penalizacion = Number(reserva.costo_total) * 0.3;

    const actualizada = await withPrismaRetry(prisma =>
      prisma.reserva.update({
        where: { id_reserva: id },
        data: { estado: 'CANCELADA', fecha_cancelacion: new Date(), monto_penalizacion: penalizacion },
      })
    );

    await withPrismaRetry(prisma =>
      prisma.registroAuditoria.create({
        data: {
          accion: 'CANCELAR_RESERVA',
          entidad_afectada: 'Reserva',
          id_entidad: id,
          descripcion: `Reserva cancelada. Penalización: $${penalizacion}`,
          ip_origen: '127.0.0.1',
          fecha_hora: new Date(),
        },
      })
    );

    return NextResponse.json(actualizada);
  } catch {
    return NextResponse.json({ error: 'Error al cancelar reserva' }, { status: 500 });
  }
}
