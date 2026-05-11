import type {
  HorarioAmenidadDTO,
  IReservaAmenidadRepository,
} from "@/domain/interfaces/repositories/IReservaAmenidadRepository";

export class ObtenerHorariosAmenidad {
  constructor(private readonly repository: IReservaAmenidadRepository) {}

  async execute(areaId: number): Promise<HorarioAmenidadDTO[]> {
    try {
      if (!areaId || Number.isNaN(areaId)) {
        throw new Error("La amenidad es obligatoria.");
      }

      return await this.repository.obtenerHorariosAmenidad(areaId);
    } catch (error) {
      console.error("Error en ObtenerHorariosAmenidad:", error);
      throw error;
    }
  }
}