import type {
  CambiarPrivacidadInput,
  IHigieneAlojamientoRepository,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class ActivarNoMolestar {
  constructor(
    private readonly repository: IHigieneAlojamientoRepository
  ) {}

  async execute(input: CambiarPrivacidadInput): Promise<void> {
    try {
      if (!input.reservaId) {
        throw new Error("La reserva es obligatoria.");
      }

      await this.repository.activarNoMolestar(input);
    } catch (error) {
      console.error("Error en ActivarNoMolestar:", error);
      throw error;
    }
  }
}