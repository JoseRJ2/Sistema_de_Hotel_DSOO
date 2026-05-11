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

export interface IniciarLimpiezaInput {
  reservaId: number;
  usuarioPersonalId: number;
  observaciones?: string;
}

export interface RegistrarInsumoInput {
  insumoId: number;
  cantidad: number;
  observaciones?: string;
}

export interface RegistrarInsumosInput {
  reservaId: number;
  insumos: RegistrarInsumoInput[];
  observaciones?: string;
}

export interface FinalizarLimpiezaInput {
  reservaId: number;
  usuarioPersonalId: number;
  observaciones?: string;
}

export interface UnidadPendienteDTO {
  id: string;
  nombre: string;
  tipoAlojamiento: "HABITACION" | "VILLA";
  estado: string;
  prioridad: boolean;
  horarioSugerido?: string;
}

export interface NotificacionDTO {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface IHigieneAlojamientoRepository {
  obtenerResumenEstancia(
    reservaId: number
  ): Promise<ResumenEstanciaDTO | null>;

  activarNoMolestar(input: CambiarPrivacidadInput): Promise<void>;

  saltarLimpiezaHoy(input: CambiarPrivacidadInput): Promise<void>;

  programarLimpieza(input: ProgramarLimpiezaInput): Promise<void>;

  iniciarLimpieza(input: IniciarLimpiezaInput): Promise<void>;

  registrarInsumos(input: RegistrarInsumosInput): Promise<void>;

  finalizarLimpieza(input: FinalizarLimpiezaInput): Promise<void>;

  obtenerUnidadesPendientes(): Promise<UnidadPendienteDTO[]>;

  obtenerNotificaciones(usuarioId: number): Promise<NotificacionDTO[]>;
}