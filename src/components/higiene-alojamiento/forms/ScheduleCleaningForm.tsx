"use client";

import { useState } from "react";
import type { CleaningScheduleFormValues } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface ScheduleCleaningFormProps {
  onSubmit?: (values: CleaningScheduleFormValues) => void;
}

const initialValues: CleaningScheduleFormValues = {
  fecha: "",
  horario: "",
  observaciones: "",
};

export default function ScheduleCleaningForm({
  onSubmit,
}: ScheduleCleaningFormProps) {
  const [values, setValues] = useState<CleaningScheduleFormValues>(initialValues);

  const handleChange = (
    key: keyof CleaningScheduleFormValues,
    value: string
  ) => {
    try {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    } catch (error) {
      console.error("Error al actualizar el formulario:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      onSubmit?.(values);
    } catch (error) {
      console.error("Error al enviar la programación de limpieza:", error);
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
          value={values.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Horario
        </label>
        <select
          value={values.horario}
          onChange={(e) => handleChange("horario", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        >
          <option value="">Selecciona un horario</option>
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:30 AM">10:30 AM</option>
          <option value="11:30 AM">11:30 AM</option>
          <option value="01:00 PM">01:00 PM</option>
        </select>
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

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Confirmar programación
      </button>
    </form>
  );
}