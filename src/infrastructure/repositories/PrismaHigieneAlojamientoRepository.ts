import { withPrismaRetry } from "@/lib/prisma";
import type {
  CambiarPrivacidadInput,
  FinalizarLimpiezaInput,
  IHigieneAlojamientoRepository,
  IniciarLimpiezaInput,
  ProgramarLimpiezaInput,
  RegistrarInsumosInput,
  ResumenEstanciaDTO,
  UnidadPendienteDTO,
  NotificacionDTO,
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

  async obtenerNotificaciones(usuarioId: number): Promise<NotificacionDTO[]> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const notificaciones = await prisma.notificacion.findMany({
          where: {
            id_usuario: usuarioId,
          },
          orderBy: {
            fecha_envio: "desc",
          },
          take: 10,
        });

        return notificaciones.map((notificacion) => ({
          id: String(notificacion.id_notificacion),
          title: notificacion.asunto,
          description: notificacion.mensaje,
          timestamp: notificacion.fecha_envio.toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        }));
      });
    } catch (error) {
      console.error("Error en obtenerNotificaciones:", error);
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

  async iniciarLimpieza(input: IniciarLimpiezaInput): Promise<void> {
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
            SolicitudServicioAlojamiento: {
              where: {
                tipo_solicitud: "PROGRAMAR_LIMPIEZA",
              },
              orderBy: {
                fecha_solicitud: "desc",
              },
              take: 1,
            },
          },
        });

        if (!reserva) {
          throw new Error("La reserva no existe.");
        }

        const solicitud = reserva.SolicitudServicioAlojamiento[0];

        await prisma.$transaction([
          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              estado_higiene: "EN_LIMPIEZA",
              estado: "EN_LIMPIEZA",
              privacidad_activa: false,
            },
          }),

          prisma.registroLimpieza.create({
            data: {
              id_solicitud: solicitud?.id_solicitud,
              id_alojamiento: reserva.id_alojamiento,
              id_usuario_personal: input.usuarioPersonalId,
              fecha_inicio: new Date(),
              checklist_completo: false,
              observaciones: input.observaciones,
            },
          }),

          prisma.notificacion.create({
            data: {
              id_usuario: reserva.Cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Limpieza en proceso",
              mensaje:
                "Tu alojamiento está siendo atendido por el personal de limpieza.",
              destinatario: reserva.Cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en iniciarLimpieza:", error);
      throw error;
    }
  }

  async registrarInsumos(input: RegistrarInsumosInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const reserva = await prisma.reserva.findUnique({
          where: {
            id_reserva: input.reservaId,
          },
          include: {
            Alojamiento: true,
          },
        });

        if (!reserva) {
          throw new Error("La reserva no existe.");
        }

        const registro = await prisma.registroLimpieza.findFirst({
          where: {
            id_alojamiento: reserva.id_alojamiento,
            fecha_fin: null,
          },
          orderBy: {
            fecha_inicio: "desc",
          },
        });

        if (!registro) {
          throw new Error("No existe una limpieza en proceso para esta reserva.");
        }

        await prisma.$transaction([
          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              estado_higiene: "REPOSICION_INSUMOS",
            },
          }),

          ...input.insumos.map((insumo) =>
            prisma.consumoInsumo.create({
              data: {
                id_registro: registro.id_registro,
                id_insumo: insumo.insumoId,
                cantidad: insumo.cantidad,
                observaciones: insumo.observaciones,
              },
            })
          ),

          ...input.insumos.map((insumo) =>
            prisma.insumo.update({
              where: {
                id_insumo: insumo.insumoId,
              },
              data: {
                stock_actual: {
                  decrement: insumo.cantidad,
                },
              },
            })
          ),
        ]);
      });
    } catch (error) {
      console.error("Error en registrarInsumos:", error);
      throw error;
    }
  }

  async finalizarLimpieza(input: FinalizarLimpiezaInput): Promise<void> {
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

        const registro = await prisma.registroLimpieza.findFirst({
          where: {
            id_alojamiento: reserva.id_alojamiento,
            fecha_fin: null,
          },
          orderBy: {
            fecha_inicio: "desc",
          },
        });

        if (!registro) {
          throw new Error("No existe una limpieza en proceso para finalizar.");
        }

        await prisma.$transaction([
          prisma.registroLimpieza.update({
            where: {
              id_registro: registro.id_registro,
            },
            data: {
              fecha_fin: new Date(),
              checklist_completo: true,
              observaciones: input.observaciones ?? registro.observaciones,
            },
          }),

          prisma.alojamiento.update({
            where: {
              id_alojamiento: reserva.id_alojamiento,
            },
            data: {
              estado: "OCUPADA",
              estado_higiene: "LIMPIA",
              privacidad_activa: false,
            },
          }),

          prisma.notificacion.create({
            data: {
              id_usuario: reserva.Cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Limpieza finalizada",
              mensaje:
                "Tu alojamiento ya fue atendido y se encuentra limpio nuevamente.",
              destinatario: reserva.Cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en finalizarLimpieza:", error);
      throw error;
    }
  }

  async obtenerUnidadesPendientes(): Promise<UnidadPendienteDTO[]> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const alojamientos = await prisma.alojamiento.findMany({
          where: {
            OR: [
              { estado_higiene: "SUCIA" },
              { estado_higiene: "PROGRAMADA" },
              { estado_higiene: "EN_ESPERA" },
              { estado_higiene: "EN_LIMPIEZA" },
              { estado_higiene: "REPOSICION_INSUMOS" },
              { estado: "NO_MOLESTAR" },
              { privacidad_activa: true },
            ],
          },
          include: {
            Reserva: {
              where: {
                estado: "CONFIRMADA",
              },
              include: {
                SolicitudServicioAlojamiento: {
                  orderBy: {
                    fecha_solicitud: "desc",
                  },
                  take: 1,
                },
              },
              take: 1,
            },
          },
          orderBy: [
            {
              tipo: "desc",
            },
            {
              estado_higiene: "asc",
            },
          ],
        });

        return alojamientos.map((alojamiento) => {
          const reserva = alojamiento.Reserva[0];
          const solicitud = reserva?.SolicitudServicioAlojamiento[0];

          return {
            id: String(alojamiento.id_alojamiento),
            nombre: alojamiento.numero_o_nombre,
            tipoAlojamiento: alojamiento.tipo.includes("VILLA")
              ? "VILLA"
              : "HABITACION",
            estado:
              alojamiento.privacidad_activa || alojamiento.estado === "NO_MOLESTAR"
                ? "NO_MOLESTAR"
                : alojamiento.estado_higiene,
            prioridad: alojamiento.tipo.includes("VILLA"),
            horarioSugerido: solicitud?.horario_programado ?? undefined,
          };
        });
      });
    } catch (error) {
      console.error("Error en obtenerUnidadesPendientes:", error);
      throw error;
    }
  }
}