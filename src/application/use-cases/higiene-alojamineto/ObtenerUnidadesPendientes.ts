import type {
  IHigieneAlojamientoRepository,
  UnidadPendienteDTO,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class ObtenerUnidadesPendientes {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(): Promise<UnidadPendienteDTO[]> {
    try {
      return await this.repository.obtenerUnidadesPendientes();
    } catch (error) {
      console.error("Error en ObtenerUnidadesPendientes:", error);
      throw error;
    }
  }
}