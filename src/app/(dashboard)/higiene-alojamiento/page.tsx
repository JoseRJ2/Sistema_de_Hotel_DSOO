"use client";

import { useCallback, useEffect, useState } from "react";
import ClientCleaningPanel from "@/components/higiene-alojamiento/sections/ClientCleaningPanel";
import CleaningTimelineSection from "@/components/higiene-alojamiento/sections/CleaningTimelineSection";
import StaffCleaningPanel from "@/components/higiene-alojamiento/sections/StaffCleaningPanel";
import type { SuppliesConsumptionFormValues } from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import { higieneAlojamientoMock } from "@/lib/mock-data/higiene-alojamiento.mock";
import type {
  CleaningTimelineItem,
  EstadoHigiene,
  NotificationItem,
  PendingCleaningUnit,
  StaySummary,
} from "@/types/higiene-alojamiento/higiene-alojamiento.types";

const RESERVA_ID = 1;
const PERSONAL_LIMPIEZA_ID = 4;
const USUARIO_CLIENTE_ID = 1;

function buildTimeline(status: EstadoHigiene): CleaningTimelineItem[] {
  const order: Array<{
    id: string;
    title: string;
    description: string;
    status: EstadoHigiene;
  }> = [
    {
      id: "step-1",
      title: "Solicitud recibida",
      description: "El cliente solicitó servicio de limpieza desde la app.",
      status: "SOLICITUD_RECIBIDA",
    },
    {
      id: "step-2",
      title: "Programada",
      description: "La limpieza fue asignada en un horario válido.",
      status: "PROGRAMADA",
    },
    {
      id: "step-3",
      title: "En espera",
      description: "Pendiente de inicio por parte del personal.",
      status: "EN_ESPERA",
    },
    {
      id: "step-4",
      title: "En limpieza",
      description: "El personal atiende la unidad.",
      status: "EN_LIMPIEZA",
    },
    {
      id: "step-5",
      title: "Reposición de insumos",
      description: "Se registran toallas, jabones y otros suministros.",
      status: "REPOSICION_INSUMOS",
    },
    {
      id: "step-6",
      title: "Limpia",
      description: "Servicio finalizado y cliente notificado.",
      status: "LIMPIA",
    },
  ];

  if (status === "NO_MOLESTAR") {
    return [
      {
        id: "privacy-step",
        title: "Privacidad activada",
        description:
          "La unidad quedó en modo No molestar y el acceso operativo fue bloqueado temporalmente.",
        completed: true,
        current: true,
      },
    ];
  }

  if (status === "CANCELADA") {
    return [
      {
        id: "cancel-step",
        title: "Limpieza omitida hoy",
        description:
          "El servicio fue omitido para hoy por solicitud del cliente.",
        completed: true,
        current: true,
      },
    ];
  }

  const statusIndex = order.findIndex((item) => item.status === status);

  return order.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    completed: statusIndex >= index,
    current: statusIndex === index,
  }));
}

function mapBackendStatusToFrontendStatus(
  estadoGeneral: string,
  estadoHigiene: string,
  privacidadActiva: boolean
): EstadoHigiene {
  if (privacidadActiva || estadoGeneral === "NO_MOLESTAR") {
    return "NO_MOLESTAR";
  }

  switch (estadoHigiene) {
    case "PROGRAMADA":
      return "PROGRAMADA";
    case "EN_ESPERA":
      return "EN_ESPERA";
    case "EN_LIMPIEZA":
      return "EN_LIMPIEZA";
    case "REPOSICION_INSUMOS":
      return "REPOSICION_INSUMOS";
    case "LIMPIA":
      return "LIMPIA";
    case "SUCIA":
      return "SUCIA";
    default:
      return "SOLICITUD_RECIBIDA";
  }
}

export default function HigieneAlojamientoPage() {
  const [staySummary, setStaySummary] = useState<StaySummary>(
    higieneAlojamientoMock.staySummary
  );

  const [timeline, setTimeline] = useState<CleaningTimelineItem[]>(
    higieneAlojamientoMock.timeline
  );

  const [pendingUnits, setPendingUnits] = useState<PendingCleaningUnit[]>(
    higieneAlojamientoMock.pendingUnits
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    higieneAlojamientoMock.notifications
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/higiene-alojamiento/notificaciones/${USUARIO_CLIENTE_ID}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("No fue posible obtener las notificaciones.");
      }

      const data = await response.json();

      setNotifications(
        data.map((notification: NotificationItem) => ({
          id: notification.id,
          title: notification.title,
          description: notification.description,
          timestamp: notification.timestamp,
        }))
      );
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  }, []);

  const addNotification = useCallback((title: string, description: string) => {
    try {
      const newNotification: NotificationItem = {
        id: crypto.randomUUID(),
        title,
        description,
        timestamp: "Justo ahora",
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } catch (error) {
      console.error("Error al agregar notificación:", error);
    }
  }, []);

  const loadPendingUnits = useCallback(async () => {
    try {
      const response = await fetch("/api/higiene-alojamiento/unidades-pendientes", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible obtener las unidades pendientes.");
      }

      const data = await response.json();

      setPendingUnits(
        data.map((unit: PendingCleaningUnit) => ({
          id: unit.id,
          nombre: unit.nombre,
          tipoAlojamiento: unit.tipoAlojamiento,
          estado: unit.estado,
          prioridad: unit.prioridad,
          horarioSugerido: unit.horarioSugerido,
        }))
      );
    } catch (error) {
      console.error("Error al cargar unidades pendientes:", error);
    }
  }, []);

  const loadResumen = useCallback(async () => {
    try {
      setIsLoading(true);
      setRequestError(null);

      const response = await fetch(
        `/api/higiene-alojamiento/resumen/${RESERVA_ID}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("No fue posible obtener el resumen de la estancia.");
      }

      const data = await response.json();

      const mappedStatus = mapBackendStatusToFrontendStatus(
        data.estadoGeneral,
        data.estadoHigiene,
        data.privacidadActiva
      );

      const mappedStaySummary: StaySummary = {
        id: String(data.alojamientoId),
        nombre: data.nombreAlojamiento,
        tipoAlojamiento: data.tipoAlojamiento.includes("VILLA")
          ? "VILLA"
          : "HABITACION",
        tipoCliente: data.rolCliente.includes("VIP")
          ? "VIP"
          : data.rolCliente.includes("PREMIUM")
            ? "PREMIUM"
            : "ESTANDAR",
        estado: mappedStatus,
        privacidadActiva: data.privacidadActiva,
        prioridad: data.tipoAlojamiento.includes("VILLA"),
        reservaActiva: true,
        fechaCheckIn: new Date(data.fechaCheckin).toISOString().split("T")[0],
        fechaCheckOut: new Date(data.fechaCheckout).toISOString().split("T")[0],
      };

      setStaySummary(mappedStaySummary);
      setTimeline(buildTimeline(mappedStatus));
    } catch (error) {
      console.error("Error al cargar el resumen:", error);
      setRequestError("No fue posible cargar la información real de la estancia.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResumen();
    void loadPendingUnits();
    void loadNotifications();
  }, [loadResumen, loadPendingUnits, loadNotifications]);

  const handleActivateNoMolestar = async () => {
    try {
      const response = await fetch("/api/higiene-alojamiento/no-molestar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: RESERVA_ID,
          observaciones: "Solicitado desde el panel del cliente.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible activar No Molestar.");
      }

      addNotification(
        "Modo privacidad activado",
        "La unidad fue marcada como No molestar y quedó fuera de la lista operativa."
      );

      await loadResumen();
      await loadPendingUnits();
      await loadNotifications();
    } catch (error) {
      console.error("Error al activar No Molestar:", error);
      throw error;
    }
  };

  const handleSkipCleaning = async () => {
    try {
      const response = await fetch("/api/higiene-alojamiento/saltar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: RESERVA_ID,
          observaciones: "El huésped decidió omitir el servicio por hoy.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible omitir la limpieza.");
      }

      addNotification(
        "Limpieza omitida hoy",
        "La limpieza del día fue omitida según la solicitud del cliente."
      );

      setTimeline(buildTimeline("CANCELADA"));
      setStaySummary((prev) => ({
        ...prev,
        estado: "CANCELADA",
        privacidadActiva: false,
      }));
    } catch (error) {
      console.error("Error al omitir limpieza:", error);
      throw error;
    }
  };

  const handleScheduleCleaning = async (fecha: string, horario: string) => {
    try {
      const response = await fetch(
        "/api/higiene-alojamiento/programar-limpieza",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservaId: RESERVA_ID,
            fechaProgramada: fecha,
            horarioProgramado: horario,
            observaciones: "Programación realizada desde el panel del cliente.",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("No fue posible programar la limpieza.");
      }

      addNotification(
        "Limpieza programada",
        `El servicio fue programado para ${fecha} a las ${horario}.`
      );

      await loadResumen();
    } catch (error) {
      console.error("Error al programar limpieza:", error);
      throw error;
    }
  };

  const handleStartCleaning = async () => {
    try {
      const response = await fetch("/api/higiene-alojamiento/iniciar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: RESERVA_ID,
          usuarioPersonalId: PERSONAL_LIMPIEZA_ID,
          observaciones: "Inicio de limpieza desde panel del personal.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible iniciar la limpieza.");
      }

      addNotification(
        "Limpieza en proceso",
        "El personal inició la atención del alojamiento."
      );

      await loadResumen();
    } catch (error) {
      console.error("Error al iniciar limpieza:", error);
      throw error;
    }
  };

  const handleRegisterSupplies = async (
    values: SuppliesConsumptionFormValues
  ) => {
    try {
      const insumos = [
        {
          insumoId: 1,
          cantidad: values.toallas,
          observaciones: "Toallas repuestas",
        },
        {
          insumoId: 2,
          cantidad: values.jabones,
          observaciones: "Jabones repuestos",
        },
        {
          insumoId: 3,
          cantidad: values.shampoo,
          observaciones: "Shampoo repuesto",
        },
        {
          insumoId: 4,
          cantidad: values.agua,
          observaciones: "Agua embotellada repuesta",
        },
      ].filter((item) => item.cantidad > 0);

      const response = await fetch("/api/higiene-alojamiento/registrar-insumos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: RESERVA_ID,
          insumos,
          observaciones: values.observaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible registrar los insumos.");
      }

      addNotification(
        "Insumos registrados",
        "Se registró la reposición de suministros del alojamiento."
      );

      await loadResumen();
    } catch (error) {
      console.error("Error al registrar insumos:", error);
      throw error;
    }
  };

  const handleFinishCleaning = async () => {
    try {
      const response = await fetch("/api/higiene-alojamiento/finalizar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: RESERVA_ID,
          usuarioPersonalId: PERSONAL_LIMPIEZA_ID,
          observaciones: "Limpieza finalizada desde panel del personal.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible finalizar la limpieza.");
      }

      addNotification(
        "Limpieza finalizada",
        "La unidad quedó marcada como limpia nuevamente."
      );

      await loadResumen();
    } catch (error) {
      console.error("Error al finalizar limpieza:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">
            Gestión hotelera
          </p>

          <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">
            Ciclo de higiene y privacidad de alojamiento
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
            Administra solicitudes de limpieza, modo privacidad, prioridades de
            atención y seguimiento del servicio para habitaciones y villas.
          </p>

          {requestError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {requestError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
              Cargando información real de la estancia...
            </div>
          ) : null}
        </header>

        <div className="grid gap-10 xl:grid-cols-[1.35fr_0.95fr]">
          <ClientCleaningPanel
            stay={staySummary}
            notifications={notifications}
            onActivateNoMolestar={handleActivateNoMolestar}
            onSkipCleaning={handleSkipCleaning}
            onScheduleCleaning={handleScheduleCleaning}
          />

          <CleaningTimelineSection items={timeline} />
        </div>

        <StaffCleaningPanel
          units={pendingUnits}
          onStartCleaning={handleStartCleaning}
          onRegisterSupplies={handleRegisterSupplies}
          onFinishCleaning={handleFinishCleaning}
        />
      </div>
    </main>
  );
}