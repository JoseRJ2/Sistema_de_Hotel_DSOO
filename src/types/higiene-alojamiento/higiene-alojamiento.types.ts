export type EstadoHigiene =
  | "DISPONIBLE"
  | "SOLICITUD_RECIBIDA"
  | "NO_MOLESTAR"
  | "PROGRAMADA"
  | "EN_ESPERA"
  | "EN_LIMPIEZA"
  | "REPOSICION_INSUMOS"
  | "LIMPIA"
  | "CANCELADA"
  | "SUCIA";

export type TipoAlojamiento = "HABITACION" | "VILLA";
export type TipoCliente = "ESTANDAR" | "PREMIUM" | "VIP";

export interface StaySummary {
  id: string;
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  tipoCliente: TipoCliente;
  estado: EstadoHigiene;
  privacidadActiva: boolean;
  prioridad: boolean;
  reservaActiva: boolean;
  fechaCheckIn: string;
  fechaCheckOut: string;
}

export interface CleaningScheduleFormValues {
  fecha: string;
  horario: string;
  observaciones: string;
}

export interface CleaningTimelineItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface PendingCleaningUnit {
  id: string;
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  estado: EstadoHigiene;
  prioridad: boolean;
  horarioSugerido?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface HigieneAlojamientoMockData {
  staySummary: StaySummary;
  timeline: CleaningTimelineItem[];
  pendingUnits: PendingCleaningUnit[];
  notifications: NotificationItem[];
}