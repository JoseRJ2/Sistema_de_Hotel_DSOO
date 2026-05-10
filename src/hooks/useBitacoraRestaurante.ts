import { useState } from 'react';

export interface ReservaMesa {
  id_reserva: number;
  cliente: string;
  membresia: string;
  turno_hora: string;
  tipo_turno: 'Desayuno' | 'Comida' | 'Cena'; 
  personas: number;
  estado: 'Pendiente' | 'En Uso' | 'Finalizada' | 'Cancelada';
}

export const useBitacoraRestaurante = () => {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<'Desayuno' | 'Comida' | 'Cena'>('Cena');

  const [reservas, setReservas] = useState<ReservaMesa[]>([
    { id_reserva: 101, cliente: 'Familia García', membresia: 'VIP', turno_hora: '07:00 - 09:00', tipo_turno: 'Desayuno', personas: 4, estado: 'Pendiente' },
    { id_reserva: 102, cliente: 'Sr. López', membresia: 'Premium', turno_hora: '13:00 - 15:00', tipo_turno: 'Comida', personas: 2, estado: 'En Uso' },
    { id_reserva: 103, cliente: 'Ana Martínez', membresia: 'Estándar', turno_hora: '19:00 - 21:00', tipo_turno: 'Cena', personas: 6, estado: 'Pendiente' },
    { id_reserva: 104, cliente: 'Familia Ruiz', membresia: 'Premium', turno_hora: '21:30 - 23:30', tipo_turno: 'Cena', personas: 3, estado: 'Pendiente' },
  ]);

  const reservasFiltradas = reservas.filter((res) => res.tipo_turno === turnoSeleccionado);

  const cambiarEstado = (id: number, nuevoEstado: ReservaMesa['estado']) => {
    setReservas((prev) =>
      prev.map((res) => (res.id_reserva === id ? { ...res, estado: nuevoEstado } : res))
    );
  };

  const cancelarReserva = (id: number) => {
    const confirmar = window.confirm('¿Confirmar que el cliente no se presentó o canceló? La mesa será liberada.');
    if (confirmar) {
      cambiarEstado(id, 'Cancelada');
    }
  };

  return {
    turnoSeleccionado,
    setTurnoSeleccionado,
    reservasFiltradas,
    cambiarEstado,
    cancelarReserva,
  };
};