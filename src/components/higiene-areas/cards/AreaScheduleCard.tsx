"use client";

import AreaScheduleForm from "@/components/higiene-areas/forms/AreaScheduleForm";
import type {
  AreaComunItem,
  AreaScheduleFormValues,
} from "@/types/higiene-areas/higiene-areas.types";

interface AreaScheduleCardProps {
  areas: AreaComunItem[];
  onSubmit?: (values: AreaScheduleFormValues) => void;
}

export default function AreaScheduleCard({
  areas,
  onSubmit,
}: AreaScheduleCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Programar ronda de higiene
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Define una ronda rutinaria, profunda o de refresco para un área común.
      </p>

      <div className="mt-5">
        <AreaScheduleForm areas={areas} onSubmit={onSubmit} />
      </div>
    </article>
  );
}