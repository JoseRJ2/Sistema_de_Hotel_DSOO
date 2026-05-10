import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

const TARIFAS: Record<string, Record<number, number>> = {
  PREMIUM: { 3: 1500, 6: 2800, 12: 5000 },
  VIP:     { 3: 3000, 6: 5500, 12: 9500 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_cliente, tipo_membresia, plan_meses, tipo_pago } = body;
    const meses = Number(plan_meses);

    const costo = TARIFAS[tipo_membresia]?.[meses];
    if (!costo) return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });

    const fechaInicio = new Date();
    const fechaFin    = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + meses);

    const membresiaActiva = await withPrismaRetry(prisma =>
      prisma.membresia.findFirst({
        where: { id_cliente: Number(id_cliente), estado: 'ACTIVA' },
      })
    );

    let membresia;
    if (membresiaActiva) {
      const nuevaFechaFin = new Date(membresiaActiva.fecha_fin);
      nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + meses);
      membresia = await withPrismaRetry(prisma =>
        prisma.membresia.update({
          where: { id_membresia: membresiaActiva.id_membresia },
          data: { fecha_fin: nuevaFechaFin, plan_meses: meses, costo_total: costo },
        })
      );
    } else {
      membresia = await withPrismaRetry(prisma =>
        prisma.membresia.create({
          data: {
            id_cliente:   Number(id_cliente),
            plan_meses:   meses,
            fecha_inicio: fechaInicio,
            fecha_fin:    fechaFin,
            estado:       'ACTIVA',
            costo_total:  costo,
          },
        })
      );
    }

    const cliente = await withPrismaRetry(prisma =>
      prisma.cliente.findUnique({ where: { id_cliente: Number(id_cliente) } })
    );
    const rolNuevo = await withPrismaRetry(prisma =>
      prisma.rol.findFirst({ where: { nombre: { contains: tipo_membresia === 'VIP' ? 'VIP' : 'Premium' } } })
    );
    if (cliente && rolNuevo) {
      await withPrismaRetry(prisma =>
        prisma.usuario.update({
          where: { id_usuario: cliente.id_usuario },
          data: { id_rol: rolNuevo.id_rol },
        })
      );
    }

    await withPrismaRetry(prisma =>
      prisma.registroAuditoria.create({
        data: {
          accion: membresiaActiva ? 'EXTENDER_MEMBRESIA' : 'ACTIVAR_MEMBRESIA',
          entidad_afectada: 'Membresia',
          id_entidad: membresia.id_membresia,
          descripcion: `Membresía ${tipo_membresia} ${meses} meses activada`,
          ip_origen: '127.0.0.1',
          fecha_hora: new Date(),
        },
      })
    );

    return NextResponse.json(membresia, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al activar membresía' }, { status: 500 });
  }
}
