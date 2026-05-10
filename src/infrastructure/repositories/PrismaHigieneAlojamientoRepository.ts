import { withPrismaRetry } from "@/lib/prisma";
import type {
  CambiarPrivacidadInput,
  IHigieneAlojamientoRepository,
  ProgramarLimpiezaInput,
  ResumenEstanciaDTO,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class PrismaHigieneAlojamientoRepository
  implements IHigieneAlojamientoRepository
{
  async obtenerResumenEstancia(
    reservaId: number
  ): Promise<ResumenEstanciaDTO | null> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const reserva = await prisma.reserva.findUnique({
          where: {
            id_reserva: reservaId,
          },
          include: {
            Alojamiento: true,
            Cliente: {
              include: {
                Usuario: {
                  include: {
                    Rol: true,
                  },
                },
              },
            },
          },
        });

        if (!reserva) {
          return null;
        }

        return {
          reservaId: reserva.id_reserva,
          alojamientoId: reserva.Alojamiento.id_alojamiento,
          nombreAlojamiento: reserva.Alojamiento.numero_o_nombre,
          tipoAlojamiento: reserva.Alojamiento.tipo,
          estadoGeneral: reserva.Alojamiento.estado,
          estadoHigiene: reserva.Alojamiento.estado_higiene,
          privacidadActiva: reserva.Alojamiento.privacidad_activa,
          clienteId: reserva.Cliente.id_cliente,
          clienteNombre: reserva.Cliente.Usuario.nombre_completo,
          clienteCorreo: reserva.Cliente.Usuario.correo_electronico,
          rolCliente: reserva.Cliente.Usuario.Rol.nombre,
          fechaCheckin: reserva.fecha_checkin,
          fechaCheckout: reserva.fecha_checkout,
          numeroHuespedes: reserva.numero_huespedes,
        };
      });
    } catch (error) {
      console.error("Error en obtenerResumenEstancia:", error);
      throw error;
    }
  }

  async activarNoMolestar(input: CambiarPrivacidadInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const reserva = await prisma.reserva.findUnique({
          where: {
            id_reserva: input.reservaId,
          },
          include: {
            Alojamiento: true,
            Cliente: {
              include: {
                Usuario: true,
              },
            },
          },
        });

        if (!reserva) {
          throw new Error("La reserva no existe.");
        }

        await prisma.$transaction([
          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              privacidad_activa: true,
              estado: "NO_MOLESTAR",
            },
          }),
          prisma.solicitudServicioAlojamiento.create({
            data: {
              id_reserva: input.reservaId,
              tipo_solicitud: "NO_MOLESTAR",
              estado_solicitud: "ATENDIDA",
              observaciones: input.observaciones,
            },
          }),
          prisma.notificacion.create({
            data: {
              id_usuario: reserva.Cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Modo privacidad activado",
              mensaje:
                "Tu alojamiento fue marcado como No molestar y se bloqueó temporalmente su atención operativa.",
              destinatario: reserva.Cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en activarNoMolestar:", error);
      throw error;
    }
  }

  async saltarLimpiezaHoy(input: CambiarPrivacidadInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const reserva = await prisma.reserva.findUnique({
          where: {
            id_reserva: input.reservaId,
          },
          include: {
            Alojamiento: true,
            Cliente: {
              include: {
                Usuario: true,
              },
            },
          },
        });

        if (!reserva) {
          throw new Error("La reserva no existe.");
        }

        await prisma.$transaction([
          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              privacidad_activa: false,
              estado_higiene: "SUCIA",
            },
          }),
          prisma.solicitudServicioAlojamiento.create({
            data: {
              id_reserva: input.reservaId,
              tipo_solicitud: "SALTAR_LIMPIEZA_HOY",
              estado_solicitud: "ATENDIDA",
              observaciones: input.observaciones,
            },
          }),
          prisma.notificacion.create({
            data: {
              id_usuario: reserva.Cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Limpieza omitida hoy",
              mensaje:
                "La limpieza del alojamiento fue omitida por hoy según tu solicitud.",
              destinatario: reserva.Cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en saltarLimpiezaHoy:", error);
      throw error;
    }
  }

  async programarLimpieza(input: ProgramarLimpiezaInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const reserva = await prisma.reserva.findUnique({
          where: {
            id_reserva: input.reservaId,
          },
          include: {
            Alojamiento: true,
            Cliente: {
              include: {
                Usuario: true,
              },
            },
          },
        });

        if (!reserva) {
          throw new Error("La reserva no existe.");
        }

        await prisma.$transaction([
          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              privacidad_activa: false,
              estado_higiene: "PROGRAMADA",
            },
          }),
          prisma.solicitudServicioAlojamiento.create({
            data: {
              id_reserva: input.reservaId,
              tipo_solicitud: "PROGRAMAR_LIMPIEZA",
              estado_solicitud: "VALIDADA",
              fecha_programada: new Date(input.fechaProgramada),
              horario_programado: input.horarioProgramado,
              observaciones: input.observaciones,
            },
          }),
          prisma.notificacion.create({
            data: {
              id_usuario: reserva.Cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Limpieza programada",
              mensaje: `Tu limpieza fue programada para ${input.fechaProgramada} a las ${input.horarioProgramado}.`,
              destinatario: reserva.Cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en programarLimpieza:", error);
      throw error;
    }
  }
}
