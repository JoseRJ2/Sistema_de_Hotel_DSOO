export interface ResumenEstanciaDTO {
  reservaId: number;
  alojamientoId: number;
  nombreAlojamiento: string;
  tipoAlojamiento: string;
  estadoGeneral: string;
  estadoHigiene: string;
  privacidadActiva: boolean;
  clienteId: number;
  clienteNombre: string;
  clienteCorreo: string;
  rolCliente: string;
  fechaCheckin: Date;
  fechaCheckout: Date;
  numeroHuespedes: number;
}

export interface CambiarPrivacidadInput {
  reservaId: number;
  observaciones?: string;
}

export interface ProgramarLimpiezaInput {
  reservaId: number;
  fechaProgramada: string;
  horarioProgramado: string;
  observaciones?: string;
}

export interface IHigieneAlojamientoRepository {
  obtenerResumenEstancia(
    reservaId: number
  ): Promise<ResumenEstanciaDTO | null>;

  activarNoMolestar(input: CambiarPrivacidadInput): Promise<void>;

  saltarLimpiezaHoy(input: CambiarPrivacidadInput): Promise<void>;

  programarLimpieza(input: ProgramarLimpiezaInput): Promise<void>;
}