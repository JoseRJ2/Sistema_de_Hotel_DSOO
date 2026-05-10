import { NextRequest, NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

class Restaurante {
  static buscarTurno(fecha: string, turno: string) {
    console.log(`[1.1] Buscando turno para fecha: ${fecha}, turno: ${turno}`);
    return { id_turno_comida: 1, fecha, tipo_turno: turno, capacidad_disponible: 50 };
  }
}

class TurnoComida {
  // Ahora recibimos también la 'membresia' para aplicar la regla
  static async hayEspacio(prisma: any, fecha: string, turno_hora: string, comensales: number, membresia: string) {
    console.log(`[1.2] Verificando espacio real. Comensales: ${comensales}, Membresía: ${membresia}`);
    
    const agregacion = await prisma.servicioRestaurante.aggregate({
      _sum: { cantidad_personas: true },
      where: {
        fecha: new Date(fecha),
        hora_bloque: turno_hora,
        estado: { not: 'CANCELADA' }
      }
    });

    const ocupados = agregacion._sum.cantidad_personas || 0;
    const CAPACIDAD_MAXIMA = 50;
    const LIMITE_REGULAR = 35; // El 70% de 50
    const lugaresDisponibles = CAPACIDAD_MAXIMA - ocupados;

    console.log(`[1.2] Ocupación actual: ${ocupados}/50`);

    // REGLA DE NEGOCIO 70/30
    if (membresia === 'CLIENTE_REGULAR' || membresia === 'ESTÁNDAR') {
      // Si es regular, vemos si sumando estos comensales superan el límite de 35
      if ((ocupados + comensales) > LIMITE_REGULAR) {
        console.log(`[1.2] Bloqueado. Capacidad regular llena. Solo VIP/Premium.`);
        return false; 
      }
    } else {
      // Si es VIP o Premium, pueden usar hasta el último de los 50 lugares
      if ((ocupados + comensales) > CAPACIDAD_MAXIMA) {
        console.log(`[1.2] Bloqueado. Restaurante 100% lleno.`);
        return false;
      }
    }

    return true; // Si pasa los if, hay espacio
  }

  static apartarLugares(comensales: number) {
    console.log(`[1.3] Lugares apartados exitosamente: ${comensales}`);
  }
}

class ReservaRestaurante {
  static async crearReserva(prisma: any, datos: any) {
    console.log(`[1.4] Guardando en Base de Datos...`);
    
    let turnoEnum = 'CENA';
    if (datos.turno_hora.includes('desayuno')) turnoEnum = 'DESAYUNO';
    if (datos.turno_hora.includes('comida')) turnoEnum = 'COMIDA';

    return await prisma.servicioRestaurante.create({
      data: {
        id_cliente: datos.id_cliente,
        fecha: new Date(datos.fecha),
        turno: turnoEnum,
        hora_bloque: datos.turno_hora,
        cantidad_personas: datos.comensales,
        tipo_servicio: datos.tipo_servicio,
        estado: 'PENDIENTE'
      }
    });
  }
}

class RegistroAuditoria {
  static registrar(mensaje: string) {
    console.log(`[1.5] [AUDITORÍA]: ${mensaje}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Agregamos 'membresia' a los datos que extraemos
    const { id_cliente, fecha, turno_hora, comensales, tipo_servicio, membresia } = body;

    return await withPrismaRetry(async (prisma) => {
      const tc = Restaurante.buscarTurno(fecha, turno_hora);

      // Le pasamos la membresía a nuestra función de validación
      const disp = await TurnoComida.hayEspacio(prisma, fecha, turno_hora, comensales, membresia);

      if (!disp) {
        // Mensaje dinámico si falla por la regla VIP
        return NextResponse.json({ message: 'Disponibilidad restringida o cupo lleno. El espacio restante es exclusivo para VIP/Premium.' }, { status: 400 });
      }

      TurnoComida.apartarLugares(comensales);

      const res = await ReservaRestaurante.crearReserva(prisma, {
        id_cliente, fecha, turno_hora, comensales, tipo_servicio
      });

      RegistroAuditoria.registrar("Reserva en restaurante");

      return NextResponse.json({ res }, { status: 201 });
    });

  } catch (error: any) {
    console.error("Error en servidor:", error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}