import type {
  AmenidadCatalogoDTO,
  IReservaAmenidadRepository,
} from "@/domain/interfaces/repositories/IReservaAmenidadRepository";

export class ObtenerCatalogoAmenidades {
  constructor(private readonly repository: IReservaAmenidadRepository) {}

  async execute(): Promise<AmenidadCatalogoDTO[]> {
    try {
      return await this.repository.obtenerCatalogoAmenidades();
    } catch (error) {
      console.error("Error en ObtenerCatalogoAmenidades:", error);
      throw error;
    }
  }
}