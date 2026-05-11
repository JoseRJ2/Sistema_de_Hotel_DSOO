"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ClientCleaningPanel from "@/components/higiene-alojamiento/sections/ClientCleaningPanel";
import { higieneAlojamientoMock } from "@/lib/mock-data/higiene-alojamiento.mock";
import type {
  NotificationItem,
  StaySummary,
} from "@/types/higiene-alojamiento/higiene-alojamiento.types";

const RESERVA_ID = 1;
const USUARIO_CLIENTE_ID = 1;

function mapBackendStatusToFrontendStatus(
  estadoGeneral: string,
  estadoHigiene: string,
  privacidadActiva: boolean
): StaySummary["estado"] {
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

export default function HigieneClientePage() {
  const [staySummary, setStaySummary] = useState<StaySummary>(
    higieneAlojamientoMock.staySummary
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

      const data: NotificationItem[] = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
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
        estado: mapBackendStatusToFrontendStatus(
          data.estadoGeneral,
          data.estadoHigiene,
          data.privacidadActiva
        ),
        privacidadActiva: data.privacidadActiva,
        prioridad: data.tipoAlojamiento.includes("VILLA"),
        reservaActiva: true,
        fechaCheckIn: new Date(data.fechaCheckin).toISOString().split("T")[0],
        fechaCheckOut: new Date(data.fechaCheckout).toISOString().split("T")[0],
      };

      setStaySummary(mappedStaySummary);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
      setRequestError("No fue posible cargar la informacion de la estancia.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResumen();
    void loadNotifications();
  }, [loadResumen, loadNotifications]);

  const addNotification = useCallback((title: string, description: string) => {
    const newNotification: NotificationItem = {
      id: crypto.randomUUID(),
      title,
      description,
      timestamp: "Justo ahora",
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const handleActivateNoMolestar = async () => {
    const response = await fetch("/api/higiene-alojamiento/no-molestar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservaId: RESERVA_ID,
        observaciones: "Solicitado desde el dashboard del cliente.",
      }),
    });

    if (!response.ok) {
      throw new Error("No fue posible activar No Molestar.");
    }

    addNotification(
      "Modo privacidad activado",
      "La habitacion fue marcada como No molestar."
    );

    await loadResumen();
    await loadNotifications();
  };

  const handleSkipCleaning = async () => {
    const response = await fetch("/api/higiene-alojamiento/saltar-limpieza", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservaId: RESERVA_ID,
        observaciones: "El huesped omitio limpieza por hoy.",
      }),
    });

    if (!response.ok) {
      throw new Error("No fue posible omitir la limpieza.");
    }

    addNotification(
      "Limpieza omitida",
      "El servicio de limpieza del dia fue omitido."
    );

    await loadResumen();
    await loadNotifications();
  };

  const handleScheduleCleaning = async (fecha: string, horario: string) => {
    const response = await fetch("/api/higiene-alojamiento/programar-limpieza", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservaId: RESERVA_ID,
        fechaProgramada: fecha,
        horarioProgramado: horario,
        observaciones: "Programacion creada desde dashboard del cliente.",
      }),
    });

    if (!response.ok) {
      throw new Error("No fue posible programar la limpieza.");
    }

    addNotification(
      "Limpieza programada",
      `El servicio fue agendado para ${fecha} a las ${horario}.`
    );

    await loadResumen();
    await loadNotifications();
  };

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link
          href="/dashboard-cliente"
          className="text-sm font-semibold text-luxury-gold"
        >
          Volver al dashboard
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">
            Gestion de higiene de habitacion
          </h1>
          <p className="mt-2 text-luxury-charcoal/70">
            Configura limpieza y privacidad de tu alojamiento.
          </p>

          {requestError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {requestError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-4 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
              Cargando estado de higiene...
            </div>
          ) : null}
        </header>

        <ClientCleaningPanel
          stay={staySummary}
          notifications={notifications}
          onActivateNoMolestar={handleActivateNoMolestar}
          onSkipCleaning={handleSkipCleaning}
          onScheduleCleaning={handleScheduleCleaning}
        />
      </div>
    </main>
  );
}
