import { withPrismaRetry } from "@/lib/prisma";
import type {
  AmenidadCatalogoDTO,
  HorarioAmenidadDTO,
  IReservaAmenidadRepository,
  ReservarAmenidadInput,
} from "@/domain/interfaces/repositories/IReservaAmenidadRepository";

export class PrismaReservaAmenidadRepository
  implements IReservaAmenidadRepository
{
  async obtenerCatalogoAmenidades(): Promise<AmenidadCatalogoDTO[]> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const areas = await prisma.areaAmenidad.findMany({
          where: {
            estado: {
              in: ["DISPONIBLE", "LIMPIA"],
            },
          },
          orderBy: {
            nombre: "asc",
          },
        });

        return areas.map((area) => ({
          id: String(area.id_area),
          nombre: area.nombre,
          tipo: area.tipo,
          descripcion: `Amenidad tipo ${area.tipo.toLowerCase()} disponible para reservación.`,
          capacidad: area.capacidad_maxima,
          estado: area.estado,
          requiereReservacion: true,
          accesoVip: area.tipo === "SPA",
        }));
      });
    } catch (error) {
      console.error("Error en obtenerCatalogoAmenidades:", error);
      throw error;
    }
  }

  async obtenerHorariosAmenidad(areaId: number): Promise<HorarioAmenidadDTO[]> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const horarios = await prisma.horarioAmenidad.findMany({
          where: {
            id_area: areaId,
          },
          orderBy: [
            {
              dia_semana: "asc",
            },
            {
              hora_inicio: "asc",
            },
          ],
        });

        return horarios.map((horario) => ({
          id: String(horario.id_horario),
          diaSemana: horario.dia_semana,
          horaInicio: horario.hora_inicio.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          horaFin: horario.hora_fin.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cupoBase: horario.cupo_base,
          bufferVip: horario.buffer_vip,
          exclusivoPremium: horario.exclusivo_premium,
          exclusivoVip: horario.exclusivo_vip,
        }));
      });
    } catch (error) {
      console.error("Error en obtenerHorariosAmenidad:", error);
      throw error;
    }
  }

  async reservarAmenidad(input: ReservarAmenidadInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const horario = await prisma.horarioAmenidad.findUnique({
          where: {
            id_horario: input.horarioId,
          },
          include: {
            AreaAmenidad: true,
          },
        });

        if (!horario) {
          throw new Error("El horario no existe.");
        }

        const cliente = await prisma.cliente.findUnique({
          where: {
            id_cliente: input.clienteId,
          },
          include: {
            Usuario: {
              include: {
                Rol: true,
              },
            },
          },
        });

        if (!cliente) {
          throw new Error("El cliente no existe.");
        }

        const totalReservado = await prisma.reservaAmenidad.aggregate({
          where: {
            id_area: input.areaId,
            id_horario: input.horarioId,
            fecha_reserva: new Date(input.fechaReserva),
            estado: {
              in: ["PENDIENTE", "CONFIRMADA"],
            },
          },
          _sum: {
            cantidad_personas: true,
          },
        });

        const ocupacionActual = totalReservado._sum.cantidad_personas ?? 0;
        const esVip = cliente.Usuario.Rol.nombre.includes("VIP");
        const capacidadPermitida = esVip
          ? horario.cupo_base + horario.buffer_vip
          : horario.cupo_base;

        if (horario.exclusivo_vip && !esVip) {
          throw new Error("Esta amenidad es exclusiva para clientes VIP.");
        }

        if (ocupacionActual + input.cantidadPersonas > capacidadPermitida) {
          throw new Error("No hay cupo disponible para este horario.");
        }

        await prisma.$transaction([
          prisma.reservaAmenidad.create({
            data: {
              id_cliente: input.clienteId,
              id_area: input.areaId,
              id_horario: input.horarioId,
              fecha_reserva: new Date(input.fechaReserva),
              cantidad_personas: input.cantidadPersonas,
              estado: "CONFIRMADA",
              recordatorio: false,
              observaciones: input.observaciones,
            },
          }),

          prisma.notificacion.create({
            data: {
              id_usuario: cliente.Usuario.id_usuario,
              tipo: "SISTEMA",
              asunto: "Reserva de amenidad confirmada",
              mensaje: `Tu reserva para ${horario.AreaAmenidad.nombre} fue confirmada correctamente.`,
              destinatario: cliente.Usuario.correo_electronico,
              enviada: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en reservarAmenidad:", error);
      throw error;
    }
  }
}