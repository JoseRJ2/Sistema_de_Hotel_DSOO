import type {
  CambiarPrivacidadInput,
  IHigieneAlojamientoRepository,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class DesactivarSaltarLimpiezaHoy {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(input: CambiarPrivacidadInput): Promise<void> {
    try {
      if (!input.reservaId) {
        throw new Error("La reserva es obligatoria.");
      }

      await this.repository.desactivarSaltarLimpiezaHoy(input);
    } catch (error) {
      console.error("Error en DesactivarSaltarLimpiezaHoy:", error);
      throw error;
    }
  }
}
