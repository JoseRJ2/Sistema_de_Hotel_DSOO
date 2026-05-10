import { useState } from 'react';

export interface AsistenciaNino {
  id_inscripcion: number;
  nombreNino: string;
  edad: number;
  habitacion_padres: string;
  id_actividad: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estado: 'Registrada' | 'En Curso' | 'Finalizada';
}

export interface ActividadDia {
  id: string;
  nombre: string;
  horario: string;
}

export const useAsistenciaKidsClub = () => {
  const agendaDia: ActividadDia[] = [
    { id: 'act_1', nombre: 'Taller de Arte y Pintura', horario: '10:00 AM - 12:00 PM' },
    { id: 'act_2', nombre: 'Manualidades', horario: '12:00 PM - 02:00 PM' },
    { id: 'act_3', nombre: 'Juegos Acuáticos', horario: '03:00 PM - 05:00 PM' },
  ];

  const [inscripciones, setInscripciones] = useState<AsistenciaNino[]>([
    { id_inscripcion: 501, nombreNino: 'Mateo García', edad: 6, habitacion_padres: 'Villa 104', id_actividad: 'act_2', hora_entrada: null, hora_salida: null, estado: 'Registrada' },
    { id_inscripcion: 502, nombreNino: 'Sofía Martínez', edad: 8, habitacion_padres: 'Habitación 302', id_actividad: 'act_2', hora_entrada: null, hora_salida: null, estado: 'Registrada' },
    { id_inscripcion: 503, nombreNino: 'Lucas Peña', edad: 5, habitacion_padres: 'Villa 201', id_actividad: 'act_1', hora_entrada: '10:05 AM', hora_salida: null, estado: 'En Curso' },
  ]);

  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadDia | null>(null);

  const ninosFiltrados = inscripciones.filter((n) => n.id_actividad === actividadSeleccionada?.id);

  const recibirNino = (id: number) => {
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInscripciones((prev) =>
      prev.map((ins) => (ins.id_inscripcion === id ? { ...ins, hora_entrada: horaActual, estado: 'En Curso' } : ins))
    );
  };

  const registrarSalida = (id: number) => {
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInscripciones((prev) =>
      prev.map((ins) => (ins.id_inscripcion === id ? { ...ins, hora_salida: horaActual, estado: 'Finalizada' } : ins))
    );
  };

  
  const liberarCupo = (id: number) => {
    const confirmar = window.confirm('¿Está seguro de que el padre canceló y desea liberar este cupo?');
    if (confirmar) {
      setInscripciones((prev) => prev.filter((ins) => ins.id_inscripcion !== id));
    }
  };

  return {
    agendaDia,
    actividadSeleccionada,
    setActividadSeleccionada,
    ninosFiltrados,
    recibirNino,
    registrarSalida,
    liberarCupo,
  };
};