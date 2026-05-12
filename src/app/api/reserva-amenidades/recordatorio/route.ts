import { NextResponse } from "next/server";
import { withPrismaRetry } from "@/lib/prisma";
import {
  createGoogleCalendarEvent,
  GoogleCalendarConfigError,
} from "@/lib/google-calendar";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function normalizeTime(value: string): string | null {
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return null;

  const compact = cleaned.replace(/\./g, "").replace(/\s+/g, "");

  const twentyFourMatch = compact.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (twentyFourMatch && !compact.endsWith("am") && !compact.endsWith("pm")) {
    const hours = Number(twentyFourMatch[1]);
    const minutes = Number(twentyFourMatch[2]);
    const seconds = Number(twentyFourMatch[3] ?? "0");

    if (hours > 23 || minutes > 59 || seconds > 59) {
      return null;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  const twelveHourMatch = compact.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  if (twelveHourMatch) {
    const rawHours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const meridiem = twelveHourMatch[3];

    if (rawHours < 1 || rawHours > 12 || minutes > 59) {
      return null;
    }

    const hours =
      meridiem === "pm" && rawHours !== 12
        ? rawHours + 12
        : meridiem === "am" && rawHours === 12
          ? 0
          : rawHours;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  }

  return null;
}

function minutesFromTime(timeValue: string): number {
  const [hourPart, minutePart] = timeValue.split(":");
  return Number(hourPart) * 60 + Number(minutePart);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const clienteId = Number(body.clienteId);
    const areaId = Number(body.areaId);
    const horarioId = Number(body.horarioId);
    const fechaReserva = String(body.fechaReserva ?? "").trim();
    const horaInicio = normalizeTime(String(body.horaInicio ?? ""));
    const horaFin = normalizeTime(String(body.horaFin ?? ""));

    if (!clienteId || !areaId || !horarioId) {
      return NextResponse.json(
        { message: "Datos de reserva incompletos para generar recordatorio." },
        { status: 400 }
      );
    }

    if (!isValidDate(fechaReserva) || !horaInicio || !horaFin) {
      return NextResponse.json(
        {
          message:
            "La fecha u horario del recordatorio no son validos. Intenta reservar de nuevo.",
        },
        { status: 400 }
      );
    }

    if (minutesFromTime(horaFin) <= minutesFromTime(horaInicio)) {
      return NextResponse.json(
        {
          message:
            "El horario seleccionado no es valido para crear el recordatorio.",
        },
        { status: 400 }
      );
    }

    const reservation = await withPrismaRetry((prisma) =>
      prisma.reservaAmenidad.findFirst({
        where: {
          id_cliente: clienteId,
          id_area: areaId,
          id_horario: horarioId,
          fecha_reserva: new Date(fechaReserva),
          estado: "CONFIRMADA",
        },
        include: {
          AreaAmenidad: true,
          Cliente: {
            include: {
              Usuario: true,
            },
          },
        },
        orderBy: {
          id_reserva_amenidad: "desc",
        },
      })
    );

    if (!reservation) {
      return NextResponse.json(
        {
          message:
            "No se encontro una reserva confirmada para crear el recordatorio.",
        },
        { status: 404 }
      );
    }

    if (reservation.recordatorio) {
      return NextResponse.json(
        {
          message:
            "Este recordatorio ya estaba agregado. Revisa tu Google Calendar.",
          action: "already_exists",
        },
        { status: 200 }
      );
    }

    const eventResult = await createGoogleCalendarEvent({
      summary: `Reserva de amenidad: ${reservation.AreaAmenidad.nombre}`,
      description: [
        `Tu reserva para ${reservation.AreaAmenidad.nombre} esta confirmada.`,
        `Fecha: ${fechaReserva}`,
        `Horario: ${horaInicio.slice(0, 5)} - ${horaFin.slice(0, 5)}`,
      ].join("\n"),
      location: "Resort - Area de amenidades",
      startDate: fechaReserva,
      startTime: horaInicio,
      endTime: horaFin,
      attendeeEmail: reservation.Cliente.Usuario.correo_electronico,
    });

    await withPrismaRetry((prisma) =>
      prisma.$transaction([
        prisma.reservaAmenidad.update({
          where: {
            id_reserva_amenidad: reservation.id_reserva_amenidad,
          },
          data: {
            recordatorio: true,
          },
        }),
        prisma.notificacion.create({
          data: {
            id_usuario: reservation.Cliente.Usuario.id_usuario,
            tipo: "SISTEMA",
            asunto: "Recordatorio de amenidad agregado",
            mensaje: `Se agrego un recordatorio para tu reserva de ${reservation.AreaAmenidad.nombre} en Google Calendar.`,
            destinatario: reservation.Cliente.Usuario.correo_electronico,
            enviada: true,
          },
        }),
      ])
    );

    return NextResponse.json(
      {
        message:
          "Recordatorio agregado correctamente. Revisa tu Google Calendar.",
        htmlLink: eventResult.htmlLink,
        action: "created",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST recordatorio amenidad:", error);

    if (error instanceof GoogleCalendarConfigError) {
      return NextResponse.json(
        {
          message:
            "La integracion con Google Calendar no esta configurada en el servidor.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "No fue posible agregar el recordatorio en Google Calendar.",
      },
      { status: 500 }
    );
  }
}
