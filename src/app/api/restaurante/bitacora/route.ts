import { NextRequest, NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

/**
 * Método: buscarPorFechas(fechaInicio, fechaFin)
 */
async function buscarPorFechas(prisma: any, inicio: Date, fin: Date) {
  return await prisma.servicioRestaurante.findMany({
    where: { fecha: { gte: inicio, lte: fin } },
    include: { Cliente: { include: { Usuario: true } } },
    orderBy: { fecha: 'asc' },
  });
}

/**
 * Mapeo de Clase: GestorRestaurante (Control)
 * Método: generarReporteAuditoria (GET)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fechaInicio = searchParams.get('fechaInicio');
  const fechaFin = searchParams.get('fechaFin');

  if (!fechaInicio || !fechaFin) return NextResponse.json({ error: 'Faltan fechas' }, { status: 400 });

  try {
    const inicio = new Date(fechaInicio);
    inicio.setUTCHours(0, 0, 0, 0);
    const fin = new Date(fechaFin);
    fin.setUTCHours(23, 59, 59, 999);

    return await withPrismaRetry(async (prisma: any) => {
      // Mensaje: buscarPorFechas
      const registros = await buscarPorFechas(prisma, inicio, fin);

      const listaMapeada = registros.map((reg: any) => ({
        ...reg,
        id_servicio: reg.id_servicio,
        nombre_huesped: reg.Cliente?.Usuario?.nombre_completo || "Sin nombre",
        tipo_cliente: reg.Cliente?.tipo_cliente || 'ESTANDAR'
      }));

      return NextResponse.json(listaMapeada);
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/**
 * Método: actualizarEstadoBitacora (PATCH)
 * Maneja transiciones: PENDIENTE -> EN_USO -> FINALIZADA / CANCELADA
 */
export async function PATCH(request: NextRequest) {
  try {
    const { id, nuevoEstado } = await request.json();
    const idNumero = Number(id);

    return await withPrismaRetry(async (prisma: any) => {
      // Transición Terminal: Se elimina de la base de datos según regla de negocio
      if (nuevoEstado === 'FINALIZADA' || nuevoEstado === 'CANCELADA') {
        await prisma.servicioRestaurante.delete({ where: { id_servicio: idNumero } });
        return NextResponse.json({ id: idNumero, accion: 'ELIMINADO' });
      }

      // Transición Activa: PENDIENTE -> EN_USO
      const actualizado = await prisma.servicioRestaurante.update({
        where: { id_servicio: idNumero },
        data: { estado: nuevoEstado },
        include: { Cliente: { include: { Usuario: true } } }
      });

      return NextResponse.json({
        ...actualizado,
        nombre_huesped: actualizado.Cliente?.Usuario?.nombre_completo || "Sin nombre",
        tipo_cliente: actualizado.Cliente?.tipo_cliente || 'ESTANDAR'
      });
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }
}