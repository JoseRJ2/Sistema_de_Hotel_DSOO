import type {
  IHigieneAlojamientoRepository,
  ProgramarLimpiezaInput,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class ProgramarLimpieza {
  constructor(
    private readonly repository: IHigieneAlojamientoRepository
  ) {}

  async execute(input: ProgramarLimpiezaInput): Promise<void> {
    try {
      if (!input.reservaId) {
        throw new Error("La reserva es obligatoria.");
      }

      if (!input.fechaProgramada) {
        throw new Error("La fecha programada es obligatoria.");
      }

      if (!input.horarioProgramado) {
        throw new Error("El horario programado es obligatorio.");
      }

      await this.repository.programarLimpieza(input);
    } catch (error) {
      console.error("Error en ProgramarLimpieza:", error);
      throw error;
    }
  }
}