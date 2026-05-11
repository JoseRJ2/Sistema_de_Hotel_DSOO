"use client";

import { useCallback, useEffect, useState } from "react";
import AreaChecklistPanel from "@/components/higiene-areas/sections/AreaChecklistPanel";
import AreaManagementPanel from "@/components/higiene-areas/sections/AreaManagementPanel";
import type {
  AreaComunItem,
  AreaScheduleFormValues,
  ChecklistTask,
} from "@/types/higiene-areas/higiene-areas.types";

const PERSONAL_LIMPIEZA_ID = 4;

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

export default function HigieneAreasPage() {
  const [areas, setAreas] = useState<AreaComunItem[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaComunItem | null>(null);
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // ==============================
  // Feedback helper
  // ==============================

  const showFeedback = (
    title: string,
    message: string,
    variant: FeedbackState["variant"] = "info"
  ) => {
    setFeedback({ title, message, variant });
  };

  useEffect(() => {
    if (!feedback) return;

    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [feedback]);

  // ==============================
  // Cargar áreas
  // ==============================

  const loadAreas = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/higiene-areas/areas", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Error al obtener áreas");
      }

      const data = await res.json();

      setAreas(data);

      // Mantener selección actual
      setSelectedArea((prev) => {
        if (!prev) return data[0] ?? null;

        return (
          data.find((area: AreaComunItem) => area.id === prev.id) ??
          data[0] ??
          null
        );
      });
    } catch (error) {
      console.error("Error cargando áreas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  // ==============================
  // Acciones
  // ==============================

  const handleScheduleArea = async (values: AreaScheduleFormValues) => {
    try {
      const response = await fetch("/api/higiene-areas/programar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          areaId: Number(values.areaId),
          usuarioAsignadoId: PERSONAL_LIMPIEZA_ID,
          tipoHigiene: values.tipoHigiene,
          fechaProgramada: values.fecha,
          horaProgramada: values.hora,
          observaciones: values.observaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo programar la higiene");
      }

      await loadAreas();

      showFeedback(
        "Ronda programada",
        "La ronda de higiene fue registrada correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error programando área:", error);

      showFeedback(
        "Error",
        "No fue posible programar la ronda de higiene.",
        "warning"
      );
    }
  };

  const handleStartArea = async () => {
    if (!selectedArea) return;

    try {
      const response = await fetch("/api/higiene-areas/iniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          areaId: Number(selectedArea.id),
          usuarioPersonalId: PERSONAL_LIMPIEZA_ID,
          tipoHigiene: "RUTINARIA",
          observaciones: "Inicio desde panel",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo iniciar la higiene");
      }

      await loadAreas();

      showFeedback(
        "Higiene iniciada",
        "El área fue marcada como en mantenimiento.",
        "info"
      );
    } catch (error) {
      console.error("Error iniciando área:", error);

      showFeedback(
        "Error",
        "No fue posible iniciar la higiene del área.",
        "warning"
      );
    }
  };

  const handleSubmitChecklist = async (tasks: ChecklistTask[]) => {
    if (!selectedArea) return;

    try {
      const response = await fetch("/api/higiene-areas/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          areaId: Number(selectedArea.id),
          tareas: tasks,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar checklist");
      }

      setChecklist(tasks);

      showFeedback(
        "Checklist guardado",
        "Las tareas fueron registradas correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error checklist:", error);

      showFeedback(
        "Error",
        "No fue posible guardar el checklist.",
        "warning"
      );
    }
  };

  const handleFinishArea = async () => {
    if (!selectedArea) return;

    try {
      const response = await fetch("/api/higiene-areas/finalizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          areaId: Number(selectedArea.id),
          observaciones: "Finalización desde panel",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al finalizar higiene");
      }

      await loadAreas();

      showFeedback(
        "Área liberada",
        "El área fue marcada como limpia correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error finalizando área:", error);

      showFeedback(
        "Error",
        "No fue posible finalizar la higiene del área.",
        "warning"
      );
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">
            Gestión hotelera
          </p>

          <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">
            Higiene de áreas públicas
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
            Administra rondas, checklist y estado de áreas comunes.
          </p>

          {isLoading && (
            <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm">
              Cargando áreas...
            </div>
          )}

          {feedback && (
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
          )}
        </header>

        <div className="grid gap-10 xl:grid-cols-[1.25fr_0.9fr]">
          <AreaManagementPanel
            areas={areas}
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
            onScheduleArea={handleScheduleArea}
          />

          <AreaChecklistPanel
            selectedArea={selectedArea}
            tasks={checklist}
            onSubmitChecklist={handleSubmitChecklist}
            onStartArea={handleStartArea}
            onFinishArea={handleFinishArea}
          />
        </div>
      </div>
    </main>
  );
}