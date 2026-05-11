"use client";

import ReservationForm from "@/components/reserva-amenidades/forms/ReservationForm";
import type {
  AmenityItem,
  ReservationFormValues,
} from "@/types/reserva-amenidades/reserva-amenidades.types";

interface ScheduleSelectionCardProps {
  amenity: AmenityItem;
  onSubmit: (values: ReservationFormValues) => void;
}

export default function ScheduleSelectionCard({
  amenity,
  onSubmit,
}: ScheduleSelectionCardProps) {
  return (
    <article className="rounded-[2rem] border border-luxury-gold/20 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-3xl text-luxury-black">
        Selección de horario
      </h3>

      <p className="mt-2 text-sm leading-6 text-luxury-charcoal/80">
        Selecciona fecha, horario y número de invitados para solicitar la
        reserva de la amenidad.
      </p>

      <div className="mt-6">
        <ReservationForm amenity={amenity} onSubmit={onSubmit} />
      </div>
    </article>
  );
}