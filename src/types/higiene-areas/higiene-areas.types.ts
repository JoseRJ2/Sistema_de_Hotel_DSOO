export type EstadoArea =
  | "DISPONIBLE"
  | "LIMPIA"
  | "EN_MANTENIMIENTO"
  | "LIMPIEZA_PROFUNDA"
  | "BLOQUEADA"
  | "INCIDENCIA";

export type TipoArea =
  | "LOBBY"
  | "PASILLO"
  | "PISCINA"
  | "RESTAURANTE"
  | "SPA"
  | "GIMNASIO"
  | "OTRA";

export type TipoHigiene = "RUTINARIA" | "PROFUNDA" | "REFRESCO";

export interface AreaComunItem {
  id: string;
  nombre: string;
  tipo: TipoArea;
  estado: EstadoArea;
  capacidadMaxima: number;
  esPasoCritico: boolean;
  selloHigieneVisible: boolean;
  ultimaLimpieza: string;
  proximaRonda: string;
}

export interface AreaScheduleFormValues {
  areaId: string;
  tipoHigiene: TipoHigiene;
  fecha: string;
  hora: string;
  observaciones: string;
}

export interface ChecklistTask {
  id: string;
  tarea: string;
  completada: boolean;
  observaciones?: string;
}

export interface HigieneAreasMockData {
  areas: AreaComunItem[];
  checklist: ChecklistTask[];
}