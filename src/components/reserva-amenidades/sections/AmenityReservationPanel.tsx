"use client";

import AmenityDetailCard from "@/components/reserva-amenidades/cards/AmenityDetailCard";
import ReservationSummaryCard from "@/components/reserva-amenidades/cards/ReservationSummaryCard";
import ScheduleSelectionCard from "@/components/reserva-amenidades/cards/ScheduleSelectionCard";
import type {
  AmenityItem,
  ReservationFormValues,
  ReservationSummary,
} from "@/types/reserva-amenidades/reserva-amenidades.types";

interface AmenityReservationPanelProps {
  amenity: AmenityItem;
  summary: ReservationSummary | null;
  onReserve: (values: ReservationFormValues) => void;
  onClearSelection: () => void;
}

export default function AmenityReservationPanel({
  amenity,
  summary,
  onReserve,
  onClearSelection,
}: AmenityReservationPanelProps) {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <AmenityDetailCard amenity={amenity} />
        <ScheduleSelectionCard amenity={amenity} onSubmit={onReserve} />
      </div>

      <div className="space-y-8">
        <ReservationSummaryCard summary={summary} />

        <button
          type="button"
          onClick={onClearSelection}
          className="rounded-xl border border-luxury-gold/40 bg-white px-5 py-3 text-sm font-semibold text-luxury-black transition hover:bg-luxury-champagne/40"
        >
          Cambiar amenidad
        </button>
      </div>
    </section>
  );
}