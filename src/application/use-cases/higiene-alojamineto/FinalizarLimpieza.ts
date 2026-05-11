import type {
  FinalizarLimpiezaInput,
  IHigieneAlojamientoRepository,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class FinalizarLimpieza {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(input: FinalizarLimpiezaInput): Promise<void> {
    try {
      if (!input.reservaId) throw new Error("La reserva es obligatoria.");
      if (!input.usuarioPersonalId) throw new Error("El personal es obligatorio.");

      await this.repository.finalizarLimpieza(input);
    } catch (error) {
      console.error("Error en FinalizarLimpieza:", error);
      throw error;
    }
  }
}