"use client";

import ScheduleCleaningForm from "@/components/higiene-alojamiento/forms/ScheduleCleaningForm";
import type { CleaningScheduleFormValues } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface ScheduleCleaningCardProps {
  onSubmit?: (values: CleaningScheduleFormValues) => void;
  onCancel?: () => void;
}

export default function ScheduleCleaningCard({
  onSubmit,
  onCancel,
}: ScheduleCleaningCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="font-serif text-2xl text-luxury-black">
            Programar limpieza
          </h3>
          <p className="mt-2 text-sm text-luxury-charcoal/80">
            Define el horario de atención. Si la capacidad está saturada, después
            podrás mostrar alternativas desde backend.
          </p>
        </div>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-luxury-gold/30 bg-white px-4 py-2 text-sm font-semibold text-luxury-black transition hover:bg-luxury-champagne/40"
          >
            Cancelar
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <ScheduleCleaningForm onSubmit={onSubmit} />
      </div>
    </article>
  );
}