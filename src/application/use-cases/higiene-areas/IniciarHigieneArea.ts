import type {
  IHigieneAreaRepository,
  IniciarHigieneAreaInput,
} from "@/domain/interfaces/repositories/IHigieneAreaRepository";

export class IniciarHigieneArea {
  constructor(private readonly repository: IHigieneAreaRepository) {}

  async execute(input: IniciarHigieneAreaInput): Promise<void> {
    try {
      if (!input.areaId) throw new Error("El área es obligatoria.");
      if (!input.usuarioPersonalId) throw new Error("El personal es obligatorio.");
      if (!input.tipoHigiene) throw new Error("El tipo de higiene es obligatorio.");

      await this.repository.iniciarHigieneArea(input);
    } catch (error) {
      console.error("Error en IniciarHigieneArea:", error);
      throw error;
    }
  }
}