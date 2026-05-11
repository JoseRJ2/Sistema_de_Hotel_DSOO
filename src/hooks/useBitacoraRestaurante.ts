import { useState } from 'react';

// Se alinea con el Diagrama de Estados
export type EstadoReserva = 'PENDIENTE' | 'EN_USO' | 'FINALIZADA' | 'CANCELADA';

export interface ReservaMesa {
  id_reserva: number;
  cliente: string;
  membresia: 'ESTÁNDAR' | 'PREMIUM' | 'VIP'; 
  turno_hora: string;
  tipo_turno: 'Desayuno' | 'Comida' | 'Cena'; 
  personas: number;
  estado: EstadoReserva;
}

export const useBitacoraRestaurante = () => {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<'Desayuno' | 'Comida' | 'Cena'>('Comida');

  const [reservas, setReservas] = useState<ReservaMesa[]>([
    { id_reserva: 101, cliente: 'Familia García', membresia: 'VIP', turno_hora: '07:00 - 09:00', tipo_turno: 'Desayuno', personas: 4, estado: 'PENDIENTE' },
    { id_reserva: 102, cliente: 'Sr. López', membresia: 'PREMIUM', turno_hora: '13:00 - 15:00', tipo_turno: 'Comida', personas: 2, estado: 'EN_USO' },
    { id_reserva: 103, cliente: 'Ana Martínez', membresia: 'ESTÁNDAR', turno_hora: '13:00 - 15:00', tipo_turno: 'Comida', personas: 6, estado: 'PENDIENTE' },
  ]);

  const reservasFiltradas = reservas.filter((res) => res.tipo_turno === turnoSeleccionado);

  // Método del Diagrama de Clases: Reserva.cambiarEstado()
  const cambiarEstado = (id: number, nuevoEstado: EstadoReserva) => {
    setReservas((prev) =>
      prev.map((r) => (r.id_reserva === id ? { ...r, estado: nuevoEstado } : r))
    );
  };

  // Método del Diagrama de Secuencia: ServicioRestaurante.asignarMesa()
  const asignarMesa = (id: number) => {
    console.log(`Mesa asignada físicamente en el restaurante para la reserva ${id}`);
    cambiarEstado(id, 'EN_USO');
  };

  // Flujo alternativo del Caso de Uso
  const cancelarReserva = (id: number) => {
    cambiarEstado(id, 'CANCELADA');
  };

  const finalizarReserva = (id: number) => {
    cambiarEstado(id, 'FINALIZADA');
  };

  return {
    turnoSeleccionado,
    setTurnoSeleccionado,
    reservasFiltradas,
    asignarMesa,
    cancelarReserva,
    finalizarReserva
  };
};