export interface AmenidadCatalogoDTO {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  capacidad: number;
  estado: string;
  requiereReservacion: boolean;
  accesoVip: boolean;
}

export interface HorarioAmenidadDTO {
  id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoBase: number;
  bufferVip: number;
  exclusivoPremium: boolean;
  exclusivoVip: boolean;
}

export interface ReservarAmenidadInput {
  clienteId: number;
  areaId: number;
  horarioId: number;
  fechaReserva: string;
  cantidadPersonas: number;
  observaciones?: string;
}

export interface IReservaAmenidadRepository {
  obtenerCatalogoAmenidades(): Promise<AmenidadCatalogoDTO[]>;
  obtenerHorariosAmenidad(areaId: number): Promise<HorarioAmenidadDTO[]>;
  reservarAmenidad(input: ReservarAmenidadInput): Promise<void>;
}