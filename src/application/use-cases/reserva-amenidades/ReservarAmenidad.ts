import type {
  IReservaAmenidadRepository,
  ReservarAmenidadInput,
} from "@/domain/interfaces/repositories/IReservaAmenidadRepository";

export class ReservarAmenidad {
  constructor(private readonly repository: IReservaAmenidadRepository) {}

  async execute(input: ReservarAmenidadInput): Promise<void> {
    try {
      if (!input.clienteId) throw new Error("El cliente es obligatorio.");
      if (!input.areaId) throw new Error("La amenidad es obligatoria.");
      if (!input.horarioId) throw new Error("El horario es obligatorio.");
      if (!input.fechaReserva) throw new Error("La fecha es obligatoria.");
      if (!input.cantidadPersonas || input.cantidadPersonas < 1) {
        throw new Error("La cantidad de personas es inválida.");
      }

      await this.repository.reservarAmenidad(input);
    } catch (error) {
      console.error("Error en ReservarAmenidad:", error);
      throw error;
    }
  }
}