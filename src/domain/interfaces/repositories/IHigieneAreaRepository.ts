// ==============================
// DTOs
// ==============================

export interface AreaComunDTO {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  capacidadMaxima: number;
  esPasoCritico: boolean;
  selloHigieneVisible: boolean;
  ultimaLimpieza: string;
  proximaRonda: string;
}

// ==============================
// Inputs - Programación
// ==============================

export interface ProgramarHigieneAreaInput {
  areaId: number;
  usuarioAsignadoId: number;
  tipoHigiene: "RUTINARIA" | "PROFUNDA" | "REFRESCO";
  fechaProgramada: string;
  horaProgramada: string;
  observaciones?: string;
}

// ==============================
// Inputs - Inicio de higiene
// ==============================

export interface IniciarHigieneAreaInput {
  areaId: number;
  usuarioPersonalId: number;
  tipoHigiene: "RUTINARIA" | "PROFUNDA" | "REFRESCO";
  observaciones?: string;
}

// ==============================
// Checklist
// ==============================

export interface ChecklistTaskInput {
  tarea: string;
  completada: boolean;
  observaciones?: string;
}

export interface RegistrarChecklistAreaInput {
  areaId: number;
  tareas: ChecklistTaskInput[];
}

// ==============================
// Finalización
// ==============================

export interface FinalizarHigieneAreaInput {
  areaId: number;
  observaciones?: string;
}

// ==============================
// Repository Interface
// ==============================

export interface IHigieneAreaRepository {
  // Lectura
  obtenerAreas(): Promise<AreaComunDTO[]>;

  // Flujo operativo
  programarHigieneArea(input: ProgramarHigieneAreaInput): Promise<void>;

  iniciarHigieneArea(input: IniciarHigieneAreaInput): Promise<void>;

  registrarChecklistArea(input: RegistrarChecklistAreaInput): Promise<void>;

  finalizarHigieneArea(input: FinalizarHigieneAreaInput): Promise<void>;
}