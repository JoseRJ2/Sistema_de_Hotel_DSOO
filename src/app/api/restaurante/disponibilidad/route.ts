import { NextRequest, NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma'; // <-- Usamos la misma conexión de tu proyecto

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get('fecha');
  const membresia = searchParams.get('membresia');

  if (!fecha || !membresia) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  try {
    // Usamos withPrismaRetry exactamente igual que en tu ruta POST de reservas
    return await withPrismaRetry(async (prisma: any) => {
      
      // 1. Consultar ocupación por cada bloque en esa fecha
      const ocupacion = await prisma.servicioRestaurante.groupBy({
        by: ['hora_bloque'],
        where: {
          fecha: new Date(fecha),
          estado: { not: 'CANCELADA' }
        },
        _sum: { cantidad_personas: true }
      });

      const CAPACIDAD_MAXIMA = 50;
      const LIMITE_REGULAR = 35; // 70%
      
      // Determinamos el límite según el usuario que está mirando
      const limiteParaEsteUsuario = (membresia === 'ESTANDAR' || membresia === 'CLIENTE_REGULAR') 
        ? LIMITE_REGULAR 
        : CAPACIDAD_MAXIMA;

      // 2. Definimos todos los turnos posibles
      const todosLosTurnos = [
        'desayuno_temprano', 'desayuno_tarde',
        'comida_temprano', 'comida_tarde',
        'cena_temprano', 'cena_tarde'
      ];

      // 3. Filtramos: Solo dejamos los que NO superan el límite
      const turnosDisponibles = todosLosTurnos.filter(turno => {
        const ocupado = ocupacion.find((o: any) => o.hora_bloque === turno)?._sum.cantidad_personas || 0;
        return ocupado < limiteParaEsteUsuario;
      });

      return NextResponse.json({ turnosDisponibles });
    });

  } catch (error: any) {
    console.error("Error en disponibilidad:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}