"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import StaffCleaningPanel from "@/components/higiene-alojamiento/sections/StaffCleaningPanel";
import type { SuppliesConsumptionFormValues } from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

const PERSONAL_LIMPIEZA_ID = 4;

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

export default function HigieneAlojamientoPage() {
  const [pendingUnits, setPendingUnits] = useState<PendingCleaningUnit[]>([]);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [processingUnitId, setProcessingUnitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const showFeedback = useCallback(
    (
      title: string,
      message: string,
      variant: FeedbackState["variant"] = "info"
    ) => {
      setFeedback({ title, message, variant });
    },
    []
  );

  const loadPendingUnits = useCallback(async () => {
    try {
      setIsLoading(true);
      setRequestError(null);

      const response = await fetch("/api/higiene-alojamiento/unidades-pendientes", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible obtener las unidades pendientes.");
      }

      const data: PendingCleaningUnit[] = await response.json();
      setPendingUnits(data);
    } catch (error) {
      console.error("Error al cargar unidades pendientes:", error);
      setRequestError("No fue posible cargar la lista de unidades pendientes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPendingUnits();
  }, [loadPendingUnits]);

  useEffect(() => {
    if (!feedback) return;

    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [feedback]);

  const handleStartCleaning = async (unit: PendingCleaningUnit) => {
    if (!unit.reservaId) {
      showFeedback(
        "No disponible",
        "Esta unidad no tiene una reserva confirmada vinculada para iniciar limpieza.",
        "warning"
      );
      return;
    }

    try {
      setProcessingUnitId(unit.id);

      const response = await fetch("/api/higiene-alojamiento/iniciar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: unit.reservaId,
          usuarioPersonalId: PERSONAL_LIMPIEZA_ID,
          observaciones: `Inicio de limpieza para ${unit.nombre} desde panel del personal.`,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "No fue posible iniciar la limpieza de la unidad."
        );
      }

      setActiveUnitId(unit.id);
      setPendingUnits((prev) =>
        prev.map((item) =>
          item.id === unit.id ? { ...item, estado: "EN_LIMPIEZA" } : item
        )
      );

      showFeedback(
        "Limpieza iniciada",
        `Puedes registrar insumos y finalizar la limpieza de ${unit.nombre} en esta misma tarjeta.`,
        "success"
      );
    } catch (error) {
      console.error("Error al iniciar limpieza:", error);
      showFeedback(
        "No se pudo iniciar la limpieza",
        error instanceof Error
          ? error.message
          : "Ocurrio un problema al iniciar la limpieza.",
        "warning"
      );
    } finally {
      setProcessingUnitId(null);
    }
  };

  const handleCompleteCleaning = async (
    unit: PendingCleaningUnit,
    values: SuppliesConsumptionFormValues
  ) => {
    if (!unit.reservaId) {
      showFeedback(
        "No disponible",
        "Esta unidad no tiene una reserva confirmada vinculada para finalizar limpieza.",
        "warning"
      );
      return;
    }

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

    if (insumos.length === 0 && !values.observaciones.trim()) {
      showFeedback(
        "Datos incompletos",
        "Registra al menos un insumo o agrega observaciones antes de finalizar.",
        "warning"
      );
      return;
    }

    try {
      setProcessingUnitId(unit.id);

      const insumosResponse = await fetch("/api/higiene-alojamiento/registrar-insumos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: unit.reservaId,
          insumos,
          observaciones: values.observaciones,
        }),
      });

      if (!insumosResponse.ok) {
        const errorBody = await insumosResponse.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "No fue posible registrar los insumos."
        );
      }

      const finishResponse = await fetch("/api/higiene-alojamiento/finalizar-limpieza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: unit.reservaId,
          usuarioPersonalId: PERSONAL_LIMPIEZA_ID,
          observaciones:
            values.observaciones ||
            `Limpieza finalizada para ${unit.nombre} desde panel del personal.`,
        }),
      });

      if (!finishResponse.ok) {
        const errorBody = await finishResponse.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "No fue posible finalizar la limpieza."
        );
      }

      setPendingUnits((prev) => prev.filter((item) => item.id !== unit.id));
      setActiveUnitId(null);

      showFeedback(
        "Limpieza finalizada",
        `${unit.nombre} fue atendida y se removio de la lista de pendientes.`,
        "success"
      );
    } catch (error) {
      console.error("Error al completar limpieza:", error);
      showFeedback(
        "No se pudo finalizar la limpieza",
        error instanceof Error
          ? error.message
          : "Ocurrio un problema al finalizar la limpieza.",
        "warning"
      );
    } finally {
      setProcessingUnitId(null);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/higiene" className="text-sm font-semibold text-luxury-gold">
          Volver a operaciones de higiene
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">
            Gestion hotelera
          </p>

          <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">
            Panel del personal de limpieza
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
            Inicia la limpieza de una unidad, registra insumos en su tarjeta y finaliza
            el servicio para retirarla automaticamente de pendientes.
          </p>

          {requestError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {requestError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
              Cargando unidades pendientes...
            </div>
          ) : null}

          {feedback ? (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm shadow-sm ${
                feedback.variant === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : feedback.variant === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-luxury-gold/30 bg-luxury-champagne/35 text-luxury-black"
              }`}
            >
              <p className="font-semibold">{feedback.title}</p>
              <p className="mt-1 opacity-85">{feedback.message}</p>
            </div>
          ) : null}
        </header>

        <StaffCleaningPanel
          units={pendingUnits}
          activeUnitId={activeUnitId}
          processingUnitId={processingUnitId}
          onStartCleaning={handleStartCleaning}
          onCompleteCleaning={handleCompleteCleaning}
          onCancelActiveUnit={() => setActiveUnitId(null)}
        />
      </div>
    </main>
  );
}
