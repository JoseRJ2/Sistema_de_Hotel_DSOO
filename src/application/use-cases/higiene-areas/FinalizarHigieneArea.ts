import type {
  FinalizarHigieneAreaInput,
  IHigieneAreaRepository,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class FinalizarHigieneArea {
  constructor(private readonly repository: IHigieneAreaRepository) {}

  async execute(input: FinalizarHigieneAreaInput): Promise<void> {
    try {
      if (!input.areaId) throw new Error("El área es obligatoria.");

      await this.repository.finalizarHigieneArea(input);
    } catch (error) {
      console.error("Error en FinalizarHigieneArea:", error);
      throw error;
    }
  }
}