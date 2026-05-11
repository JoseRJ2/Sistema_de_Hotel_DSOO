import type {
  IHigieneAlojamientoRepository,
  NotificacionDTO,
} from "@/domain/interfaces/repositories/IHigieneAlojamientoRepository";

export class ObtenerNotificaciones {
  constructor(private readonly repository: IHigieneAlojamientoRepository) {}

  async execute(usuarioId: number): Promise<NotificacionDTO[]> {
    try {
      if (!usuarioId || Number.isNaN(usuarioId)) {
        throw new Error("El usuario es obligatorio.");
      }

      return await this.repository.obtenerNotificaciones(usuarioId);
    } catch (error) {
      console.error("Error en ObtenerNotificaciones:", error);
      throw error;
    }
  }
}