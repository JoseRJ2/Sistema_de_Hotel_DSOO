import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaDesde  = searchParams.get('fechaDesde');   // YYYY-MM-DD
    const fechaHasta  = searchParams.get('fechaHasta');   // YYYY-MM-DD
    const tipoAloj    = searchParams.get('tipoAloj');     // 'VILLA_PREMIUM' | 'habitacion' | ''
    const tipoCliente = searchParams.get('tipoCliente');  // 'VIP' | 'PREMIUM' | 'ESTANDAR' | ''
    const estado      = searchParams.get('estado');       // 'CONFIRMADA' | 'CANCELADA' | ... | ''

    // ── Filtros base para prisma ──────────────────────────────────────
    const where: Record<string, any> = {};
    if (fechaDesde) where.fecha_checkin = { ...(where.fecha_checkin ?? {}), gte: new Date(fechaDesde) };
    if (fechaHasta) where.fecha_checkin = { ...(where.fecha_checkin ?? {}), lte: new Date(fechaHasta + 'T23:59:59') };
    if (estado) where.estado = estado;

    const [reservas, reservasRestaurante, asistenciasKids] = await Promise.all([
      withPrismaRetry(prisma =>
        prisma.reserva.findMany({
          where,
          include: {
            Alojamiento: true,
            Cliente: { include: { Usuario: { include: { Rol: true } } } },
            Pago: true,
          },
        })
      ),
      withPrismaRetry(async prisma => {
        try { return await (prisma as any).reservaRestaurante.findMany({ include: { Turno: true } }); }
        catch { return []; }
      }),
      withPrismaRetry(async prisma => {
        try { return await (prisma as any).asistenciaKidsClub.findMany(); }
        catch { return []; }
      }),
    ]);

    // ── Filtros en memoria (tipo alojamiento y tipo cliente) ──────────
    let reservasFiltradas: any[] = reservas as any[];

    if (tipoAloj === 'VILLA_PREMIUM') {
      reservasFiltradas = reservasFiltradas.filter(r => r.Alojamiento?.tipo === 'VILLA_PREMIUM');
    } else if (tipoAloj === 'habitacion') {
      reservasFiltradas = reservasFiltradas.filter(r => r.Alojamiento?.tipo !== 'VILLA_PREMIUM');
    }

    if (tipoCliente) {
      reservasFiltradas = reservasFiltradas.filter(r => {
        const rol = r.Cliente?.Usuario?.Rol?.nombre?.toUpperCase() ?? '';
        const tc = rol.includes('VIP') ? 'VIP' : rol.includes('PREMIUM') ? 'PREMIUM' : 'ESTANDAR';
        return tc === tipoCliente;
      });
    }

    // ── Villas vs Habitaciones ────────────────────────────────────────
    const reservasVilla       = reservasFiltradas.filter(r => r.Alojamiento?.tipo === 'VILLA_PREMIUM');
    const reservasHabitacion  = reservasFiltradas.filter(r => r.Alojamiento?.tipo !== 'VILLA_PREMIUM');

    const ingresos = (list: any[]) =>
      list.reduce((s, r) => s + (r.Pago?.[0]?.monto ? Number(r.Pago[0].monto) : 0), 0);

    const ingresosVilla       = ingresos(reservasVilla);
    const ingresosHabitacion  = ingresos(reservasHabitacion);

    // ── Villas por tipo de cliente ────────────────────────────────────
    const villasPorTipoCliente: Record<string, number> = {};
    for (const r of reservasVilla) {
      const rol = r.Cliente?.Usuario?.Rol?.nombre?.toUpperCase() ?? '';
      const tipo = rol.includes('VIP') ? 'VIP' : rol.includes('PREMIUM') ? 'PREMIUM' : 'ESTÁNDAR';
      villasPorTipoCliente[tipo] = (villasPorTipoCliente[tipo] ?? 0) + 1;
    }

    // ── Ocupación mensual (últimos 6 meses relativos al rango) ────────
    const refFin  = fechaHasta ? new Date(fechaHasta) : new Date();
    const ocupacionMensual: { mes: string; villas: number; habitaciones: number; ingresos: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const inicio = new Date(refFin.getFullYear(), refFin.getMonth() - i, 1);
      const fin    = new Date(refFin.getFullYear(), refFin.getMonth() - i + 1, 0, 23, 59, 59);
      const label  = inicio.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
      const enMes  = (r: any) => { const ci = new Date(r.fecha_checkin); return ci >= inicio && ci <= fin; };
      ocupacionMensual.push({
        mes: label,
        villas:       reservasVilla.filter(enMes).length,
        habitaciones: reservasHabitacion.filter(enMes).length,
        ingresos:     ingresos([...reservasVilla, ...reservasHabitacion].filter(enMes)),
      });
    }

    // ── Ranking de villas ─────────────────────────────────────────────
    const rankingMap: Record<string, { nombre: string; reservas: number; ingresos: number }> = {};
    for (const r of reservasVilla) {
      const nombre = r.Alojamiento?.numero_o_nombre ?? `ID-${r.id_alojamiento}`;
      if (!rankingMap[nombre]) rankingMap[nombre] = { nombre, reservas: 0, ingresos: 0 };
      rankingMap[nombre].reservas++;
      rankingMap[nombre].ingresos += r.Pago?.[0]?.monto ? Number(r.Pago[0].monto) : 0;
    }

    // ── Estados ───────────────────────────────────────────────────────
    const estadosReservas = reservasFiltradas.reduce((acc: Record<string, number>, r: any) => {
      acc[r.estado] = (acc[r.estado] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const promNoches = (list: any[]) =>
      list.length === 0 ? 0 : +(list.reduce((s, r) => s + (r.num_noches ?? 0), 0) / list.length).toFixed(1);

    return NextResponse.json({
      filtrosAplicados: { fechaDesde, fechaHasta, tipoAloj, tipoCliente, estado },
      resumen: {
        totalReservas:        reservasFiltradas.length,
        reservasVilla:        reservasVilla.length,
        reservasHabitacion:   reservasHabitacion.length,
        ingresosVilla:        +ingresosVilla.toFixed(2),
        ingresosHabitacion:   +ingresosHabitacion.toFixed(2),
        ingresosTotal:        +(ingresosVilla + ingresosHabitacion).toFixed(2),
        promNochesVilla:      promNoches(reservasVilla),
        promNochesHabitacion: promNoches(reservasHabitacion),
        totalRestaurante:     (reservasRestaurante as any[]).length,
        totalKids:            (asistenciasKids as any[]).length,
      },
      villasPorTipoCliente,
      ocupacionMensual,
      rankingVillas: Object.values(rankingMap).sort((a, b) => b.reservas - a.reservas).slice(0, 5),
      estadosReservas,
    });
  } catch (error: any) {
    console.error('Error en reporte:', error);
    return NextResponse.json({ error: error?.message || 'Error al generar reporte' }, { status: 500 });
  }
}
