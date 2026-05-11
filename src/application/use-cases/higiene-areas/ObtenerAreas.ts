import type {
  IHigieneAreaRepository,
  AreaComunDTO,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class ObtenerAreas {
  constructor(private readonly repository: IHigieneAreaRepository) {}

  async execute(): Promise<AreaComunDTO[]> {
    try {
      const areas = await this.repository.obtenerAreas();

      // Validación simple (opcional pero recomendable)
      if (!areas || !Array.isArray(areas)) {
        throw new Error("No se pudieron obtener las áreas.");
      }

      return areas;
    } catch (error) {
      console.error("Error en ObtenerAreas:", error);
      throw error;
    }
  }
}