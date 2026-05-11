import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const body = await req.json();
    const { id_alojamiento, fecha_check_in, fecha_check_out, tipo_pago } = body;

    const reservaActual = await withPrismaRetry(prisma =>
      prisma.reserva.findUnique({
        where: { id_reserva: id },
        include: { Cliente: { include: { Usuario: { include: { Rol: true } } } }, Pago: true },
      })
    );

    if (!reservaActual) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    if (reservaActual.estado === 'CANCELADA' || reservaActual.estado === 'COMPLETADA') {
      return NextResponse.json({ error: 'No se puede modificar una reserva cancelada o completada' }, { status: 400 });
    }

    const alojamiento = await withPrismaRetry(prisma =>
      prisma.alojamiento.findUnique({ where: { id_alojamiento: Number(id_alojamiento) } })
    );
    if (!alojamiento) return NextResponse.json({ error: 'Alojamiento no encontrado' }, { status: 404 });

    const checkIn = new Date(fecha_check_in);
    const checkOut = new Date(fecha_check_out);
    const numNoches = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (numNoches < 1) return NextResponse.json({ error: 'Las fechas no son válidas' }, { status: 400 });
    if (alojamiento.tipo === 'VILLA_PREMIUM' && numNoches < 2) {
      return NextResponse.json({ error: 'Las villas requieren mínimo 2 noches' }, { status: 400 });
    }

    // Verificar superposición con otras reservas (excluyendo la actual)
    const superposicion = await withPrismaRetry(prisma =>
      prisma.reserva.findFirst({
        where: {
          id_alojamiento: Number(id_alojamiento),
          estado: { not: 'CANCELADA' },
          id_reserva: { not: id },
          fecha_checkin: { lt: checkOut },
          fecha_checkout: { gt: checkIn },
        },
      })
    );

    if (superposicion) {
      return NextResponse.json({ error: 'El alojamiento ya está reservado en estas fechas' }, { status: 400 });
    }

    const tipoCliente = reservaActual.Cliente?.Usuario?.Rol?.nombre?.toUpperCase() ?? 'ESTANDAR';

    if (alojamiento.tipo === 'VILLA_PREMIUM' && !tipoCliente.includes('PREMIUM') && !tipoCliente.includes('VIP')) {
      return NextResponse.json({ error: 'Solo clientes Premium y VIP pueden reservar villas' }, { status: 400 });
    }

    let regla: any[] = [];
    try {
      regla = await withPrismaRetry(prisma =>
        prisma.$queryRaw`
          SELECT porcentaje_premium, porcentaje_vip
          FROM ReglaUpgrade
          WHERE noches_desde <= ${numNoches} AND noches_hasta >= ${numNoches}
          LIMIT 1
        `
      );
    } catch (_) {}

    const porcentaje = tipoCliente.includes('VIP')
      ? (regla[0]?.porcentaje_vip ?? 100)
      : tipoCliente.includes('PREMIUM')
        ? (regla[0]?.porcentaje_premium ?? 100)
        : 100;

    const precioBase = Number(alojamiento.precio_base);
    const costoTotal = precioBase * numNoches * (porcentaje / 100);

    const reservaActualizada = await withPrismaRetry(prisma =>
      prisma.reserva.update({
        where: { id_reserva: id },
        data: {
          id_alojamiento: Number(id_alojamiento),
          fecha_checkin: checkIn,
          fecha_checkout: checkOut,
        },
        include: { Pago: true },
      })
    );

    // Actualizar pago si existe
    if (reservaActual.Pago && reservaActual.Pago.length > 0) {
      await withPrismaRetry(prisma =>
        prisma.pago.update({
          where: { id_pago: reservaActual.Pago[0].id_pago },
          data: {
            monto: costoTotal,
            ...(tipo_pago ? { metodo_pago: tipo_pago } : {}),
          },
        })
      );
    }

    return NextResponse.json({
      ...reservaActualizada,
      fecha_check_in: reservaActualizada.fecha_checkin,
      fecha_check_out: reservaActualizada.fecha_checkout,
      costo_total: costoTotal,
      num_noches: numNoches,
      porcentaje_upgrade: porcentaje,
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/reservas/[id]:', error);
    return NextResponse.json({ error: error?.message || 'Error al modificar reserva' }, { status: 500 });
  }
}
