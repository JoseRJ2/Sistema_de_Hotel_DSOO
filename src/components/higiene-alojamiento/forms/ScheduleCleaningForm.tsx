"use client";

import { useState } from "react";
import type { CleaningScheduleFormValues } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface ScheduleCleaningFormProps {
  minDate?: string;
  maxDate?: string;
  onSubmit?: (values: CleaningScheduleFormValues) => void;
}

const initialValues: CleaningScheduleFormValues = {
  fecha: "",
  horario: "",
  observaciones: "",
};

function to12HourFormat(time24: string): string {
  const [hourRaw, minuteRaw] = time24.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return time24;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalizedHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default function ScheduleCleaningForm({
  minDate,
  maxDate,
  onSubmit,
}: ScheduleCleaningFormProps) {
  const [values, setValues] = useState<CleaningScheduleFormValues>(initialValues);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (key: keyof CleaningScheduleFormValues, value: string) => {
    try {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));
      setFormError(null);
    } catch (error) {
      console.error("Error al actualizar el formulario:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      if (!values.fecha || !values.horario) {
        setFormError("Selecciona fecha y horario para continuar.");
        return;
      }

      if (minDate && values.fecha < minDate) {
        setFormError(
          `La fecha seleccionada debe ser igual o posterior a ${minDate}.`
        );
        return;
      }

      if (maxDate && values.fecha > maxDate) {
        setFormError(
          `La fecha seleccionada debe ser igual o anterior a ${maxDate}.`
        );
        return;
      }

      onSubmit?.({
        ...values,
        horario: to12HourFormat(values.horario),
      });
    } catch (error) {
      console.error("Error al enviar la programacion de limpieza:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Fecha
        </label>
        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={values.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Horario
        </label>
        <input
          type="time"
          min="07:00"
          max="22:00"
          step={1800}
          value={values.horario}
          onChange={(e) => handleChange("horario", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
        <p className="mt-1 text-xs text-luxury-charcoal/65">
          Rango disponible: 07:00 AM a 10:00 PM (cada 30 minutos).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Observaciones
        </label>
        <textarea
          value={values.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          rows={4}
          placeholder="Ej. Favor de reponer toallas y agua embotellada."
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      {formError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Confirmar programacion
      </button>
    </form>
  );
}
