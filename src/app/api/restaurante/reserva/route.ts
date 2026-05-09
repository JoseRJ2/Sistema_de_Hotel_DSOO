import { NextRequest, NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { 
      id_cliente, 
      fecha, 
      turno, 
      hora_bloque, 
      cantidad_personas, 
      tipo_servicio 
    } = body;

    const nuevaReserva = await withPrismaRetry(async (prisma) => {
      return await prisma.servicioRestaurante.create({
        data: {
          id_cliente: id_cliente,
          fecha: new Date(fecha), 
          turno: turno,           
          hora_bloque: hora_bloque,
          cantidad_personas: cantidad_personas,
          tipo_servicio: tipo_servicio,
          estado: 'PENDIENTE'    
        },
      });
    });

    return NextResponse.json({ message: 'Reserva creada', reserva: nuevaReserva }, { status: 201 });

  } catch (error: any) {
    console.error('Error al guardar la reserva:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}