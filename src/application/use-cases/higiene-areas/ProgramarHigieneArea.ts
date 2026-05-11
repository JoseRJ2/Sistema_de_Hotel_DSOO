import type {
  IHigieneAreaRepository,
  ProgramarHigieneAreaInput,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class ProgramarHigieneArea {
  constructor(private readonly repository: IHigieneAreaRepository) {}

  async execute(input: ProgramarHigieneAreaInput): Promise<void> {
    try {
      if (!input.areaId) throw new Error("El área es obligatoria.");
      if (!input.usuarioAsignadoId) throw new Error("El usuario asignado es obligatorio.");
      if (!input.fechaProgramada) throw new Error("La fecha es obligatoria.");
      if (!input.horaProgramada) throw new Error("La hora es obligatoria.");

      await this.repository.programarHigieneArea(input);
    } catch (error) {
      console.error("Error en ProgramarHigieneArea:", error);
      throw error;
    }
  }
}