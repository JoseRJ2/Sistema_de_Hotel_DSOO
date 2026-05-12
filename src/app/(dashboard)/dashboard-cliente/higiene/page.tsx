"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CleaningTimelineSection from "@/components/higiene-alojamiento/sections/CleaningTimelineSection";
import FeedbackAlert from "@/components/higiene-alojamiento/shared/FeedbackAlert";
import ScheduleCleaningCard from "@/components/higiene-alojamiento/cards/ScheduleCleaningCard";
import { higieneAlojamientoMock } from "@/lib/mock-data/higiene-alojamiento.mock";
import type {
  CleaningTimelineItem,
  EstadoHigiene,
} from "@/types/higiene-alojamiento/higiene-alojamiento.types";
import { useDashboardClienteContext } from "@/hooks/useDashboardClienteContext";

type HygienePreference =
  | "NO_MOLESTAR"
  | "SALTAR_LIMPIEZA"
  | "PROGRAMAR_LIMPIEZA"
  | null;

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

interface StayDateRange {
  minDate: string;
  maxDate: string;
}

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
      description: "El cliente solicito servicio de limpieza desde la app.",
      status: "SOLICITUD_RECIBIDA",
    },
    {
      id: "step-2",
      title: "Programada",
      description: "La limpieza fue asignada en un horario valido.",
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
      title: "Reposicion de insumos",
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
          "La unidad quedo en modo No molestar y el acceso operativo fue bloqueado temporalmente.",
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

function getPreferenceFromStatus(status: EstadoHigiene): HygienePreference {
  if (status === "NO_MOLESTAR") return "NO_MOLESTAR";
  if (status === "CANCELADA") return "SALTAR_LIMPIEZA";
  if (status === "PROGRAMADA") return "PROGRAMAR_LIMPIEZA";
  return null;
}

function mapBackendPreferenceToFrontend(
  preferencia: string | null | undefined,
  fallbackStatus: EstadoHigiene
): HygienePreference {
  if (preferencia === "NO_MOLESTAR") return "NO_MOLESTAR";
  if (preferencia === "SALTAR_LIMPIEZA_HOY") return "SALTAR_LIMPIEZA";
  if (preferencia === "PROGRAMAR_LIMPIEZA") return "PROGRAMAR_LIMPIEZA";
  return getPreferenceFromStatus(fallbackStatus);
}

export default function HigieneClientePage() {
  const { usuario, reservaId, loading: contextLoading, sessionReady } =
    useDashboardClienteContext();
  const [timeline, setTimeline] = useState<CleaningTimelineItem[]>(
    higieneAlojamientoMock.timeline
  );
  const [activePreference, setActivePreference] = useState<HygienePreference>(
    getPreferenceFromStatus(higieneAlojamientoMock.staySummary.estado)
  );
  const [showScheduleCard, setShowScheduleCard] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [stayDateRange, setStayDateRange] = useState<StayDateRange>({
    minDate: higieneAlojamientoMock.staySummary.fechaCheckIn,
    maxDate: higieneAlojamientoMock.staySummary.fechaCheckOut,
  });

  const loadResumen = useCallback(async () => {
    if (!reservaId) {
      setTimeline(higieneAlojamientoMock.timeline);
      setRequestError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setRequestError(null);

      const response = await fetch(
        `/api/higiene-alojamiento/resumen/${reservaId}`,
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
      const minDate = new Date(data.fechaCheckin).toISOString().split("T")[0];
      const maxDate = new Date(data.fechaCheckout).toISOString().split("T")[0];

      setTimeline(buildTimeline(mappedStatus));
      setStayDateRange({ minDate, maxDate });
      setActivePreference(
        mapBackendPreferenceToFrontend(
          data.preferenciaHigieneActiva,
          mappedStatus
        )
      );
    } catch (error) {
      console.error("Error al cargar resumen:", error);
      setRequestError("No fue posible cargar la informacion de la estancia.");
    } finally {
      setIsLoading(false);
    }
  }, [reservaId]);

  useEffect(() => {
    if (!contextLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadResumen();
    }
  }, [loadResumen, contextLoading]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const highlightedPreference = useMemo(
    () => (showScheduleCard ? "PROGRAMAR_LIMPIEZA" : activePreference),
    [showScheduleCard, activePreference]
  );

  const handleActivateNoMolestar = async () => {
    if (!reservaId) {
      setFeedback({
        title: "Sin reserva activa",
        message: "No encontramos una reserva activa para aplicar esta accion.",
        variant: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setShowScheduleCard(false);

      const response = await fetch("/api/higiene-alojamiento/no-molestar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId,
          observaciones: "Solicitado desde el dashboard del cliente.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible activar No Molestar.");
      }

      const result = await response.json();

      setFeedback({
        title:
          result.action === "deactivated"
            ? "Preferencia desactivada"
            : "Preferencia aplicada",
        message:
          result.message ??
          "El modo No molestar fue actualizado correctamente.",
        variant: result.action === "deactivated" ? "info" : "success",
      });

      await loadResumen();
    } catch (error) {
      console.error("Error al activar No Molestar:", error);
      setFeedback({
        title: "No se pudo completar la accion",
        message: "Ocurrio un problema al activar No molestar.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipCleaning = async () => {
    if (!reservaId) {
      setFeedback({
        title: "Sin reserva activa",
        message: "No encontramos una reserva activa para aplicar esta accion.",
        variant: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setShowScheduleCard(false);

      const response = await fetch("/api/higiene-alojamiento/saltar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId,
          observaciones: "El huesped omitio limpieza por hoy.",
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible omitir la limpieza.");
      }

      const result = await response.json();

      setFeedback({
        title:
          result.action === "deactivated"
            ? "Preferencia desactivada"
            : "Preferencia aplicada",
        message:
          result.message ??
          "La preferencia de limpieza de hoy fue actualizada correctamente.",
        variant: "info",
      });

      await loadResumen();
    } catch (error) {
      console.error("Error al omitir limpieza:", error);
      setFeedback({
        title: "No se pudo completar la accion",
        message: "Ocurrio un problema al omitir la limpieza.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleCleaning = async (fecha: string, horario: string) => {
    if (!reservaId) {
      setFeedback({
        title: "Sin reserva activa",
        message: "No encontramos una reserva activa para aplicar esta accion.",
        variant: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/higiene-alojamiento/programar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId,
          fechaProgramada: fecha,
          horarioProgramado: horario,
          observaciones: "Programacion creada desde dashboard del cliente.",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "No fue posible programar la limpieza."
        );
      }

      const result = await response.json();

      setShowScheduleCard(false);
      setFeedback({
        title:
          result.action === "deactivated"
            ? "Preferencia desactivada"
            : "Preferencia aplicada",
        message:
          result.message ??
          `La limpieza fue programada para ${fecha} a las ${horario}.`,
        variant: "success",
      });

      await loadResumen();
    } catch (error) {
      console.error("Error al programar limpieza:", error);
      setFeedback({
        title: "No se pudo completar la accion",
        message: "Ocurrio un problema al programar la limpieza.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProgramPreferenceClick = async () => {
    if (!reservaId) {
      setFeedback({
        title: "Sin reserva activa",
        message: "No encontramos una reserva activa para aplicar esta accion.",
        variant: "warning",
      });
      return;
    }

    if (activePreference !== "PROGRAMAR_LIMPIEZA") {
      setShowScheduleCard((prev) => !prev);
      return;
    }

    try {
      setIsSubmitting(true);
      setShowScheduleCard(false);

      const response = await fetch("/api/higiene-alojamiento/programar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId,
          desactivar: true,
          observaciones: "Desactivado desde el dashboard del cliente.",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ??
            "No fue posible desactivar la limpieza programada."
        );
      }

      const result = await response.json();

      setFeedback({
        title: "Preferencia desactivada",
        message:
          result.message ??
          "La limpieza programada fue desactivada correctamente.",
        variant: "info",
      });

      await loadResumen();
    } catch (error) {
      console.error("Error al alternar programacion de limpieza:", error);
      setFeedback({
        title: "No se pudo completar la accion",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrio un problema al actualizar la programacion.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const preferenceBaseClass =
    "w-full rounded-2xl border p-4 text-left shadow-sm transition";

  const getPreferenceClass = (
    preference: Exclude<HygienePreference, null>,
    variant: "primary" | "secondary" | "danger"
  ) => {
    const isActive = highlightedPreference === preference;

    const variantStyles = {
      primary:
        "border-luxury-gold/40 bg-white text-luxury-black hover:bg-luxury-champagne/40",
      secondary:
        "border-luxury-gold/40 bg-white text-luxury-black hover:bg-luxury-champagne/40",
      danger:
        "border-luxury-black/30 bg-white text-luxury-black hover:bg-luxury-champagne/40",
    };

    if (!isActive) {
      return `${preferenceBaseClass} ${variantStyles[variant]}`;
    }

    return `${preferenceBaseClass} border-luxury-gold bg-luxury-champagne/45 text-luxury-black ring-2 ring-luxury-gold/60 shadow-md`;
  };

  if (contextLoading) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando sesion del cliente...
          </div>
        </div>
      </main>
    );
  }

  if (!sessionReady || !usuario) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl text-luxury-black">
              Acceso restringido
            </h1>
            <p className="mt-2 text-luxury-charcoal/70">
              Inicia sesion como cliente para gestionar tu higiene de estancia.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-luxury-black px-5 py-2 text-sm font-semibold text-luxury-ivory"
            >
              Ir a iniciar sesion
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            Define tu preferencia y da seguimiento al estado del servicio.
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

        {feedback ? (
          <FeedbackAlert
            title={feedback.title}
            message={feedback.message}
            variant={feedback.variant}
          />
        ) : null}

        {isSubmitting ? (
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Procesando preferencia...
          </div>
        ) : null}

        <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-2xl text-luxury-black">
            Preferencias de higiene y privacidad
          </h3>
          <p className="mt-2 text-sm text-luxury-charcoal/80">
            Selecciona una accion para tu estancia actual.
          </p>
          <div className="mt-4 rounded-2xl border border-luxury-gold/25 bg-luxury-champagne/25 p-4 text-sm text-luxury-charcoal/80">
            Puedes hacer click de nuevo sobre una preferencia activa para
            desactivarla. Si no hay ninguna preferencia activa, el personal
            continuara con la limpieza rutinaria.
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={handleActivateNoMolestar}
              className={getPreferenceClass("NO_MOLESTAR", "danger")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">No molestar</div>
                {highlightedPreference === "NO_MOLESTAR" ? (
                  <span className="rounded-full bg-luxury-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-luxury-ivory">
                    Activa
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm opacity-80">
                Bloquea temporalmente el acceso del personal de limpieza.
              </div>
            </button>

            <button
              type="button"
              onClick={handleSkipCleaning}
              className={getPreferenceClass("SALTAR_LIMPIEZA", "secondary")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">Saltar limpieza hoy</div>
                {highlightedPreference === "SALTAR_LIMPIEZA" ? (
                  <span className="rounded-full bg-luxury-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-luxury-ivory">
                    Activa
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm opacity-80">
                Omite la limpieza de hoy sin activar modo privacidad.
              </div>
            </button>

            <button
              type="button"
              onClick={() => void handleProgramPreferenceClick()}
              className={getPreferenceClass("PROGRAMAR_LIMPIEZA", "primary")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">Programar limpieza</div>
                {highlightedPreference === "PROGRAMAR_LIMPIEZA" ? (
                  <span className="rounded-full bg-luxury-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-luxury-ivory">
                    Activa
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm opacity-80">
                Elige fecha y horario para atender tu unidad.
              </div>
            </button>
          </div>
        </article>

        {showScheduleCard ? (
          <ScheduleCleaningCard
            minDate={stayDateRange.minDate}
            maxDate={stayDateRange.maxDate}
            onSubmit={(values) =>
              void handleScheduleCleaning(values.fecha, values.horario)
            }
            onCancel={() => setShowScheduleCard(false)}
          />
        ) : null}

        <CleaningTimelineSection items={timeline} />
      </div>
    </main>
  );
}
