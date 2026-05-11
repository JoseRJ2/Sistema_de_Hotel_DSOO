import { withPrismaRetry } from "@/lib/prisma";
import type {
  AreaComunDTO,
  ChecklistTaskInput,
  FinalizarHigieneAreaInput,
  IHigieneAreaRepository,
  IniciarHigieneAreaInput,
  ProgramarHigieneAreaInput,
  RegistrarChecklistAreaInput,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class PrismaHigieneAreaRepository implements IHigieneAreaRepository {
  async obtenerAreas(): Promise<AreaComunDTO[]> {
    try {
      return await withPrismaRetry(async (prisma) => {
        const areas = await prisma.areaAmenidad.findMany({
          include: {
            RegistroLimpieza: {
              where: {
                fecha_fin: {
                  not: null,
                },
              },
              orderBy: {
                fecha_fin: "desc",
              },
              take: 1,
            },
            ProgramacionHigieneArea: {
              where: {
                estado_programacion: "PENDIENTE",
              },
              orderBy: [
                {
                  fecha_programada: "asc",
                },
                {
                  hora_programada: "asc",
                },
              ],
              take: 1,
            },
          },
          orderBy: {
            nombre: "asc",
          },
        });

        return areas.map((area) => {
          const ultimoRegistro = area.RegistroLimpieza[0];
          const proximaProgramacion = area.ProgramacionHigieneArea[0];

          return {
            id: String(area.id_area),
            nombre: area.nombre,
            tipo: area.tipo,
            estado: area.estado,
            capacidadMaxima: area.capacidad_maxima,
            esPasoCritico: area.es_paso_critico,
            selloHigieneVisible: area.sello_higiene_visible,
            ultimaLimpieza: ultimoRegistro?.fecha_fin
              ? ultimoRegistro.fecha_fin.toLocaleString("es-MX", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "Sin registro",
            proximaRonda: proximaProgramacion
              ? `${proximaProgramacion.fecha_programada.toLocaleDateString(
                  "es-MX"
                )} ${proximaProgramacion.hora_programada.toLocaleTimeString(
                  "es-MX",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`
              : "Sin programación",
          };
        });
      });
    } catch (error) {
      console.error("Error en obtenerAreas:", error);
      throw error;
    }
  }

  async programarHigieneArea(input: ProgramarHigieneAreaInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const area = await prisma.areaAmenidad.findUnique({
          where: {
            id_area: input.areaId,
          },
        });

        if (!area) {
          throw new Error("El área no existe.");
        }

        await prisma.programacionHigieneArea.create({
          data: {
            id_area: input.areaId,
            id_usuario_asignado: input.usuarioAsignadoId,
            tipo_higiene: input.tipoHigiene,
            fecha_programada: new Date(input.fechaProgramada),
            hora_programada: new Date(`1970-01-01T${input.horaProgramada}:00`),
            estado_programacion: "PENDIENTE",
            observaciones: input.observaciones,
          },
        });
      });
    } catch (error) {
      console.error("Error en programarHigieneArea:", error);
      throw error;
    }
  }

  async iniciarHigieneArea(input: IniciarHigieneAreaInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const area = await prisma.areaAmenidad.findUnique({
          where: {
            id_area: input.areaId,
          },
        });

        if (!area) {
          throw new Error("El área no existe.");
        }

        await prisma.$transaction([
          prisma.areaAmenidad.update({
            where: {
              id_area: input.areaId,
            },
            data: {
              estado:
                input.tipoHigiene === "PROFUNDA"
                  ? "LIMPIEZA_PROFUNDA"
                  : "EN_MANTENIMIENTO",
              sello_higiene_visible: false,
            },
          }),

          prisma.registroLimpieza.create({
            data: {
              id_area: input.areaId,
              id_usuario_personal: input.usuarioPersonalId,
              fecha_inicio: new Date(),
              checklist_completo: false,
              observaciones: input.observaciones,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en iniciarHigieneArea:", error);
      throw error;
    }
  }

  async registrarChecklistArea(
    input: RegistrarChecklistAreaInput
  ): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const registro = await prisma.registroLimpieza.findFirst({
          where: {
            id_area: input.areaId,
            fecha_fin: null,
          },
          orderBy: {
            fecha_inicio: "desc",
          },
        });

        if (!registro) {
          throw new Error("No existe una higiene en proceso para esta área.");
        }

        await prisma.$transaction([
          ...input.tareas.map((tarea: ChecklistTaskInput) =>
            prisma.checklistHigieneArea.create({
              data: {
                id_registro: registro.id_registro,
                tarea: tarea.tarea,
                completada: tarea.completada,
                observaciones: tarea.observaciones,
              },
            })
          ),

          prisma.registroLimpieza.update({
            where: {
              id_registro: registro.id_registro,
            },
            data: {
              checklist_completo: input.tareas.every(
                (tarea) => tarea.completada
              ),
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en registrarChecklistArea:", error);
      throw error;
    }
  }

  async finalizarHigieneArea(input: FinalizarHigieneAreaInput): Promise<void> {
    try {
      await withPrismaRetry(async (prisma) => {
        const registro = await prisma.registroLimpieza.findFirst({
          where: {
            id_area: input.areaId,
            fecha_fin: null,
          },
          orderBy: {
            fecha_inicio: "desc",
          },
        });

        if (!registro) {
          throw new Error("No existe una higiene en proceso para finalizar.");
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

          prisma.areaAmenidad.update({
            where: {
              id_area: input.areaId,
            },
            data: {
              estado: "LIMPIA",
              sello_higiene_visible: true,
            },
          }),
        ]);
      });
    } catch (error) {
      console.error("Error en finalizarHigieneArea:", error);
      throw error;
    }
  }
}