"use client";

import { useState } from "react";
import type {
  AmenityItem,
  ReservationFormValues,
} from "@/types/reserva-amenidades/reserva-amenidades.types";

interface ReservationFormProps {
  amenity: AmenityItem;
  onSubmit: (values: ReservationFormValues) => void;
}

export default function ReservationForm({
  amenity,
  onSubmit,
}: ReservationFormProps) {
  const firstSchedule = amenity.horarioDisponible[0];

  const [values, setValues] = useState<ReservationFormValues>({
    amenidadId: amenity.id,
    fecha: "",
    horarioId: firstSchedule?.horarioId ?? "",
    horarioLabel: firstSchedule?.horarioLabel ?? "",
    invitados: 1,
    comentarios: "",
  });

  const handleChange = (
    key: keyof ReservationFormValues,
    value: string | number
  ) => {
    setValues((prev) => ({
      ...prev,
      amenidadId: amenity.id,
      [key]: value,
    }));
  };

  const handleScheduleChange = (horarioId: string) => {
    const selectedSchedule = amenity.horarioDisponible.find(
      (schedule) => schedule.horarioId === horarioId
    );

    setValues((prev) => ({
      ...prev,
      horarioId,
      horarioLabel: selectedSchedule?.horarioLabel ?? "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Fecha
        </label>
        <input
          type="date"
          value={values.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Horario
        </label>
        <select
          value={values.horarioId}
          onChange={(e) => handleScheduleChange(e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          required
        >
          {amenity.horarioDisponible.map((schedule) => (
            <option key={schedule.horarioId} value={schedule.horarioId}>
              {schedule.horarioLabel}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Número de invitados
        </label>
        <input
          type="number"
          min={1}
          max={amenity.capacidad}
          value={values.invitados}
          onChange={(e) => handleChange("invitados", Number(e.target.value))}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Comentarios
        </label>
        <textarea
          rows={4}
          value={values.comentarios}
          onChange={(e) => handleChange("comentarios", e.target.value)}
          placeholder="Ej. Solicitar acceso preferente o alguna indicación especial."
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Confirmar solicitud
      </button>
    </form>
  );
}