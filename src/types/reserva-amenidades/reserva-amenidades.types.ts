export interface AmenityScheduleOption {
  horarioId: string;
  horarioLabel: string;
}

export interface AmenityItem {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  capacidad: number;
  estado: string;
  imagen?: string;
  horarioDisponible: AmenityScheduleOption[];
  requiereReservacion: boolean;
  accesoVip: boolean;
}

export interface ReservationFormValues {
  amenidadId: string;
  fecha: string;
  horarioId: string;
  horarioLabel: string;
  invitados: number;
  comentarios?: string;
}

export interface ReservationSummary {
  amenidad: string;
  fecha: string;
  horario: string;
  invitados: number;
  nivelCliente: string;
  estado: string;
}