import type {
  IHigieneAlojamientoRepository,
  ResumenEstanciaDTO,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class ObtenerResumenEstancia {
  constructor(
    private readonly repository: IHigieneAlojamientoRepository
  ) {}

  async execute(reservaId: number): Promise<ResumenEstanciaDTO | null> {
    try {
      if (!reservaId || Number.isNaN(reservaId)) {
        throw new Error("El id de la reserva es inválido.");
      }

      return await this.repository.obtenerResumenEstancia(reservaId);
    } catch (error) {
      console.error("Error en ObtenerResumenEstancia:", error);
      throw error;
    }
  }
}