"use client";

import CleaningOptionButton from "@/components/higiene-alojamiento/shared/CleaningOptionButton";

interface PrivacyActionsCardProps {
  onNoMolestar?: () => void;
  onSkipCleaning?: () => void;
  onOpenSchedule?: () => void;
}

export default function PrivacyActionsCard({
  onNoMolestar,
  onSkipCleaning,
  onOpenSchedule,
}: PrivacyActionsCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Preferencias de higiene y privacidad
      </h3>
      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Selecciona una acción para tu estancia actual.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <CleaningOptionButton
          label="No molestar"
          description="Bloquea el acceso al personal de limpieza mientras esté activo."
          variant="danger"
          onClick={onNoMolestar}
        />

        <CleaningOptionButton
          label="Saltar limpieza hoy"
          description="Omite el servicio por hoy sin activar el modo privacidad."
          onClick={onSkipCleaning}
        />

        <CleaningOptionButton
          label="Programar limpieza"
          description="Elige fecha y horario para atender la unidad."
          variant="primary"
          onClick={onOpenSchedule}
        />
      </div>
    </article>
  );
}