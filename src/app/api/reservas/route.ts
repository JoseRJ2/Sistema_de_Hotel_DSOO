import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const reservas = await withPrismaRetry(prisma =>
      prisma.reserva.findMany({
        include: { Pago: true, Alojamiento: true, Cliente: { include: { Usuario: true } } },
        orderBy: { id_reserva: 'desc' },
      })
    );
    return NextResponse.json(reservas);
  } catch {
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_cliente, id_alojamiento, fecha_check_in, fecha_check_out, tipo_pago } = body;

    const alojamiento = await withPrismaRetry(prisma =>
      prisma.alojamiento.findUnique({ where: { id_alojamiento: Number(id_alojamiento) } })
    );
    if (!alojamiento) return NextResponse.json({ error: 'Alojamiento no encontrado' }, { status: 404 });

    const checkIn  = new Date(fecha_check_in);
    const checkOut = new Date(fecha_check_out);
    const numNoches = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (numNoches < 1) return NextResponse.json({ error: 'Las fechas no son válidas' }, { status: 400 });
    if (alojamiento.tipo === 'VILLA_PREMIUM' && numNoches < 2) {
      return NextResponse.json({ error: 'Las villas requieren mínimo 2 noches' }, { status: 400 });
    }

    const cliente = await withPrismaRetry(prisma =>
      prisma.cliente.findUnique({
        where: { id_cliente: Number(id_cliente) },
        include: { Usuario: { include: { Rol: true } } },
      })
    );

    const tipoCliente = cliente?.Usuario?.Rol?.nombre?.toUpperCase() ?? 'ESTANDAR';

    if (alojamiento.tipo === 'VILLA_PREMIUM' && !tipoCliente.includes('PREMIUM') && !tipoCliente.includes('VIP')) {
      return NextResponse.json({ error: 'Solo clientes Premium y VIP pueden reservar villas' }, { status: 400 });
    }

    const regla = await withPrismaRetry(prisma =>
      prisma.$queryRaw<{ porcentaje_premium: number; porcentaje_vip: number }[]>`
        SELECT porcentaje_premium, porcentaje_vip
        FROM ReglaUpgrade
        WHERE noches_desde <= ${numNoches} AND noches_hasta >= ${numNoches}
        LIMIT 1
      `
    );

    const porcentaje = tipoCliente.includes('VIP')
      ? (regla[0]?.porcentaje_vip ?? 100)
      : tipoCliente.includes('PREMIUM')
      ? (regla[0]?.porcentaje_premium ?? 100)
      : 100;

    const precioBase = Number(alojamiento.precio_base);
    const costoTotal = precioBase * numNoches * (porcentaje / 100);
    const codigoConf = `RES-${Date.now()}`;

    const reserva = await withPrismaRetry(prisma =>
      prisma.reserva.create({
        data: {
          id_cliente:          Number(id_cliente),
          id_alojamiento:      Number(id_alojamiento),
          fecha_check_in:      checkIn,
          fecha_check_out:     checkOut,
          num_noches:          numNoches,
          precio_base_noche:   precioBase,
          porcentaje_upgrade:  porcentaje,
          costo_total:         costoTotal,
          estado:              'CONFIRMADA',
          codigo_confirmacion: codigoConf,
          fecha_creacion:      new Date(),
          monto_penalizacion:  0,
          Pago: {
            create: {
              monto:       costoTotal,
              tipo_pago,
              estado:      'APROBADO',
              referencia:  `PAG-${Date.now()}`,
              fecha_hora:  new Date(),
              descripcion: `Pago reserva ${codigoConf}`,
            },
          },
        },
        include: { Pago: true },
      })
    );

    return NextResponse.json(reserva, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 });
  }
}
