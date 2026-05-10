"use client";

import { useEffect, useState } from "react";
import NotificationsCard from "@/components/higiene-alojamiento/cards/NotificationsCard";
import PrivacyActionsCard from "@/components/higiene-alojamiento/cards/PrivacyActionsCard";
import ScheduleCleaningCard from "@/components/higiene-alojamiento/cards/ScheduleCleaningCard";
import StaySummaryCard from "@/components/higiene-alojamiento/cards/StaySummaryCard";
import FeedbackAlert from "@/components/higiene-alojamiento/shared/FeedbackAlert";
import SectionHeader from "@/components/higiene-alojamiento/shared/SectionHeader";
import type {
  CleaningScheduleFormValues,
  NotificationItem,
  StaySummary,
} from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface ClientCleaningPanelProps {
  stay: StaySummary;
  notifications: NotificationItem[];
  onActivateNoMolestar: () => Promise<void>;
  onSkipCleaning: () => Promise<void>;
  onScheduleCleaning: (fecha: string, horario: string) => Promise<void>;
}

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

export default function ClientCleaningPanel({
  stay,
  notifications,
  onActivateNoMolestar,
  onSkipCleaning,
  onScheduleCleaning,
}: ClientCleaningPanelProps) {
  const [showScheduleCard, setShowScheduleCard] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!feedback) return;

    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [feedback]);

  const handleNoMolestar = async () => {
    try {
      setIsSubmitting(true);
      setShowScheduleCard(false);
      await onActivateNoMolestar();

      setFeedback({
        title: "Modo privacidad activado",
        message:
          "La unidad quedó marcada como No molestar y se ocultará de la lista operativa mientras esté activa.",
        variant: "warning",
      });
    } catch (error) {
      console.error("Error al activar No Molestar:", error);
      setFeedback({
        title: "No se pudo completar la acción",
        message: "Ocurrió un problema al activar el modo privacidad.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipCleaning = async () => {
    try {
      setIsSubmitting(true);
      setShowScheduleCard(false);
      await onSkipCleaning();

      setFeedback({
        title: "Limpieza omitida por hoy",
        message:
          "El servicio de limpieza fue omitido para hoy sin activar modo privacidad.",
        variant: "info",
      });
    } catch (error) {
      console.error("Error al saltar limpieza:", error);
      setFeedback({
        title: "No se pudo completar la acción",
        message: "Ocurrió un problema al omitir la limpieza del día.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSchedule = () => {
    try {
      setShowScheduleCard(true);
      setFeedback(null);
    } catch (error) {
      console.error("Error al abrir programación de limpieza:", error);
    }
  };

  const handleCloseSchedule = () => {
    try {
      setShowScheduleCard(false);
    } catch (error) {
      console.error("Error al cerrar programación:", error);
    }
  };

  const handleScheduleSubmit = async (values: CleaningScheduleFormValues) => {
    try {
      setIsSubmitting(true);

      await onScheduleCleaning(values.fecha, values.horario);

      setFeedback({
        title: "Limpieza programada",
        message: `El servicio fue programado para ${
          values.fecha || "la fecha seleccionada"
        } a las ${values.horario || "hora elegida"}.`,
        variant: "success",
      });

      setShowScheduleCard(false);
    } catch (error) {
      console.error("Error al programar limpieza:", error);
      setFeedback({
        title: "No se pudo completar la acción",
        message: "Ocurrió un problema al programar la limpieza.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Panel del cliente"
        subtitle="Controla privacidad, preferencias y programación del servicio."
      />

      {feedback ? (
        <FeedbackAlert
          title={feedback.title}
          message={feedback.message}
          variant={feedback.variant}
        />
      ) : null}

      {isSubmitting ? (
        <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
          Procesando solicitud...
        </div>
      ) : null}

      <StaySummaryCard stay={stay} />

      <PrivacyActionsCard
        onNoMolestar={handleNoMolestar}
        onSkipCleaning={handleSkipCleaning}
        onOpenSchedule={handleOpenSchedule}
      />

      {showScheduleCard ? (
        <ScheduleCleaningCard
          onSubmit={handleScheduleSubmit}
          onCancel={handleCloseSchedule}
        />
      ) : null}

      <NotificationsCard notifications={notifications} />
    </section>
  );
}