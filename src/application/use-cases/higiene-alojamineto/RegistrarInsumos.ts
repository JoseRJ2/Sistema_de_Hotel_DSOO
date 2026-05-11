import type {
  IHigieneAlojamientoRepository,
  RegistrarInsumosInput,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class RegistrarInsumos {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(input: RegistrarInsumosInput): Promise<void> {
    try {
      if (!input.reservaId) throw new Error("La reserva es obligatoria.");
      if (!input.insumos?.length) throw new Error("Debes registrar al menos un insumo.");

      await this.repository.registrarInsumos(input);
    } catch (error) {
      console.error("Error en RegistrarInsumos:", error);
      throw error;
    }
  }
}