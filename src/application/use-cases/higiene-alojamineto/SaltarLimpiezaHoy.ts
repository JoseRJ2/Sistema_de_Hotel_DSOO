import type {
  CambiarPrivacidadInput,
  IHigieneAlojamientoRepository,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class SaltarLimpiezaHoy {
  constructor(
    private readonly repository: IHigieneAlojamientoRepository
  ) {}

  async execute(input: CambiarPrivacidadInput): Promise<void> {
    try {
      if (!input.reservaId) {
        throw new Error("La reserva es obligatoria.");
      }

      await this.repository.saltarLimpiezaHoy(input);
    } catch (error) {
      console.error("Error en SaltarLimpiezaHoy:", error);
      throw error;
    }
  }
}