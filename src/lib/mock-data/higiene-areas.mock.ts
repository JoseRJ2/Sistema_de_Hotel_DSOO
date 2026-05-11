import type { HigieneAreasMockData } from "@/types/higiene-areas/higiene-areas.types";

export const higieneAreasMock: HigieneAreasMockData = {
  areas: [
    {
      id: "area-001",
      nombre: "Lobby Principal",
      tipo: "LOBBY",
      estado: "DISPONIBLE",
      capacidadMaxima: 80,
      esPasoCritico: true,
      selloHigieneVisible: true,
      ultimaLimpieza: "Hoy 08:00 AM",
      proximaRonda: "Hoy 12:00 PM",
    },
    {
      id: "area-002",
      nombre: "Restaurante Terraza",
      tipo: "RESTAURANTE",
      estado: "LIMPIEZA_PROFUNDA",
      capacidadMaxima: 120,
      esPasoCritico: false,
      selloHigieneVisible: false,
      ultimaLimpieza: "Hoy 10:30 AM",
      proximaRonda: "Hoy 02:00 PM",
    },
    {
      id: "area-003",
      nombre: "Piscina Infinity",
      tipo: "PISCINA",
      estado: "LIMPIA",
      capacidadMaxima: 60,
      esPasoCritico: false,
      selloHigieneVisible: true,
      ultimaLimpieza: "Hoy 09:15 AM",
      proximaRonda: "Hoy 01:15 PM",
    },
  ],
  checklist: [
    {
      id: "task-001",
      tarea: "Desinfectar superficies de alto contacto",
      completada: false,
    },
    {
      id: "task-002",
      tarea: "Vaciar contenedores de residuos",
      completada: false,
    },
    {
      id: "task-003",
      tarea: "Revisar aroma ambiental y presentación visual",
      completada: false,
    },
    {
      id: "task-004",
      tarea: "Confirmar liberación segura del área",
      completada: false,
    },
  ],
};