import { NextResponse } from "next/server";
import { withPrismaRetry } from "@/lib/prisma";

interface Params {
  params: Promise<{
    clienteId: string;
  }>;
}

type ReservationStatus = "PENDIENTE" | "CONFIRMADA";

interface DashboardReservationItem {
  id: string;
  tipo: "ALOJAMIENTO" | "AMENIDAD";
  titulo: string;
  subtitulo: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: ReservationStatus;
  referencia?: string;
}

function toDateOnly(value: Date): string {
  return value.toISOString().split("T")[0];
}

function toTime(value: Date): string {
  return value.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function GET(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const clienteId = Number(resolvedParams.clienteId);

    if (!clienteId || Number.isNaN(clienteId)) {
      return NextResponse.json(
        { message: "El id de cliente no es valido." },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stayReservations, amenityReservations] = await withPrismaRetry(
      async (prisma) => {
        const reservasAlojamiento = prisma.reserva.findMany({
          where: {
            id_cliente: clienteId,
            estado: {
              in: ["PENDIENTE", "CONFIRMADA"],
            },
            fecha_checkout: {
              gte: today,
            },
          },
          include: {
            Alojamiento: true,
          },
          orderBy: {
            fecha_checkin: "asc",
          },
        });

        const reservasAmenidad = prisma.reservaAmenidad.findMany({
          where: {
            id_cliente: clienteId,
            estado: {
              in: ["PENDIENTE", "CONFIRMADA"],
            },
            fecha_reserva: {
              gte: today,
            },
          },
          include: {
            AreaAmenidad: true,
            HorarioAmenidad: true,
          },
          orderBy: [
            {
              fecha_reserva: "asc",
            },
            {
              id_reserva_amenidad: "desc",
            },
          ],
        });

        return Promise.all([reservasAlojamiento, reservasAmenidad]);
      }
    );

    const mappedStayReservations: DashboardReservationItem[] =
      stayReservations.map((reservation) => ({
        id: `ALOJ-${reservation.id_reserva}`,
        tipo: "ALOJAMIENTO",
        titulo: reservation.Alojamiento.numero_o_nombre,
        subtitulo: reservation.Alojamiento.tipo.replace(/_/g, " "),
        fechaInicio: toDateOnly(reservation.fecha_checkin),
        fechaFin: toDateOnly(reservation.fecha_checkout),
        estado: reservation.estado,
      }));

    const mappedAmenityReservations: DashboardReservationItem[] =
      amenityReservations.map((reservation) => ({
        id: `AME-${reservation.id_reserva_amenidad}`,
        tipo: "AMENIDAD",
        titulo: reservation.AreaAmenidad.nombre,
        subtitulo: `${reservation.HorarioAmenidad.dia_semana} - ${toTime(
          reservation.HorarioAmenidad.hora_inicio
        )} - ${toTime(reservation.HorarioAmenidad.hora_fin)}`,
        fechaInicio: toDateOnly(reservation.fecha_reserva),
        estado: reservation.estado,
      }));

    const reservations = [...mappedStayReservations, ...mappedAmenityReservations]
      .sort((a, b) => {
        const first = new Date(`${a.fechaInicio}T00:00:00`).getTime();
        const second = new Date(`${b.fechaInicio}T00:00:00`).getTime();
        return first - second;
      });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error en GET reservas pendientes del cliente:", error);

    return NextResponse.json(
      {
        message:
          "No fue posible obtener las reservas pendientes del cliente.",
      },
      { status: 500 }
    );
  }
}
