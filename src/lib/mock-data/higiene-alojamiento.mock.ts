import type { HigieneAlojamientoMockData } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

export const higieneAlojamientoMock: HigieneAlojamientoMockData = {
  staySummary: {
    id: "stay-001",
    nombre: "Villa Premium Esmeralda",
    tipoAlojamiento: "VILLA",
    tipoCliente: "VIP",
    estado: "PROGRAMADA",
    privacidadActiva: false,
    prioridad: true,
    reservaActiva: true,
    fechaCheckIn: "2026-04-21",
    fechaCheckOut: "2026-04-26",
  },
  timeline: [
    {
      id: "step-1",
      title: "Solicitud recibida",
      description: "El cliente solicitó servicio de limpieza desde la app.",
      completed: true,
    },
    {
      id: "step-2",
      title: "Programada",
      description: "La limpieza fue asignada en un horario válido.",
      completed: true,
      current: true,
    },
    {
      id: "step-3",
      title: "En espera",
      description: "Pendiente de inicio por parte del personal.",
      completed: false,
    },
    {
      id: "step-4",
      title: "En limpieza",
      description: "El personal atiende la unidad.",
      completed: false,
    },
    {
      id: "step-5",
      title: "Reposición de insumos",
      description: "Se registran toallas, jabones y otros suministros.",
      completed: false,
    },
    {
      id: "step-6",
      title: "Limpia",
      description: "Servicio finalizado y cliente notificado.",
      completed: false,
    },
  ],
  pendingUnits: [
    {
      id: "unit-001",
      nombre: "Villa Premium Esmeralda",
      tipoAlojamiento: "VILLA",
      estado: "PROGRAMADA",
      prioridad: true,
      horarioSugerido: "11:30 AM",
    },
    {
      id: "unit-002",
      nombre: "Habitación 204",
      tipoAlojamiento: "HABITACION",
      estado: "SUCIA",
      prioridad: false,
      horarioSugerido: "12:00 PM",
    },
    {
      id: "unit-003",
      nombre: "Habitación 117",
      tipoAlojamiento: "HABITACION",
      estado: "NO_MOLESTAR",
      prioridad: false,
    },
  ],
  notifications: [
    {
      id: "not-001",
      title: "Limpieza programada",
      description: "Tu servicio fue programado para las 11:30 AM.",
      timestamp: "Hace 10 minutos",
    },
    {
      id: "not-002",
      title: "Personal asignado",
      description: "El equipo de limpieza ya fue notificado.",
      timestamp: "Hace 8 minutos",
    },
  ],
};