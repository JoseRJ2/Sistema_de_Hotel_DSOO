import type {
  IHigieneAlojamientoRepository,
  IniciarLimpiezaInput,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class IniciarLimpieza {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(input: IniciarLimpiezaInput): Promise<void> {
    try {
      if (!input.reservaId) throw new Error("La reserva es obligatoria.");
      if (!input.usuarioPersonalId) throw new Error("El personal es obligatorio.");

      await this.repository.iniciarLimpieza(input);
    } catch (error) {
      console.error("Error en IniciarLimpieza:", error);
      throw error;
    }
  }
}