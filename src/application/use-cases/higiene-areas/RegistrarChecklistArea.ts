import type {
  IHigieneAreaRepository,
  RegistrarChecklistAreaInput,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class RegistrarChecklistArea {
  constructor(private readonly repository: IHigieneAreaRepository) {}

  async execute(input: RegistrarChecklistAreaInput): Promise<void> {
    try {
      if (!input.areaId) throw new Error("El área es obligatoria.");
      if (!input.tareas?.length) throw new Error("Debe existir al menos una tarea.");

      await this.repository.registrarChecklistArea(input);
    } catch (error) {
      console.error("Error en RegistrarChecklistArea:", error);
      throw error;
    }
  }
}