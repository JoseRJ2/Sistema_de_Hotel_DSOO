"use client";

import { useState } from "react";
import type {
  AreaComunItem,
  AreaScheduleFormValues,
  TipoHigiene,
} from "@/types/higiene-areas/higiene-areas.types";

interface AreaScheduleFormProps {
  areas: AreaComunItem[];
  onSubmit?: (values: AreaScheduleFormValues) => void;
}

const initialValues: AreaScheduleFormValues = {
  areaId: "",
  tipoHigiene: "RUTINARIA",
  fecha: "",
  hora: "",
  observaciones: "",
};

export default function AreaScheduleForm({
  areas,
  onSubmit,
}: AreaScheduleFormProps) {
  const [values, setValues] = useState<AreaScheduleFormValues>(initialValues);

  const handleChange = (
    key: keyof AreaScheduleFormValues,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTipoChange = (value: TipoHigiene) => {
    setValues((prev) => ({
      ...prev,
      tipoHigiene: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Área
        </label>
        <select
          value={values.areaId}
          onChange={(e) => handleChange("areaId", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        >
          <option value="">Selecciona un área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
            Tipo
          </label>
          <select
            value={values.tipoHigiene}
            onChange={(e) => handleTipoChange(e.target.value as TipoHigiene)}
            className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          >
            <option value="RUTINARIA">Rutinaria</option>
            <option value="PROFUNDA">Profunda</option>
            <option value="REFRESCO">Refresco</option>
          </select>
        </div>

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
            Hora
          </label>
          <input
            type="time"
            value={values.hora}
            onChange={(e) => handleChange("hora", e.target.value)}
            className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
          Observaciones
        </label>
        <textarea
          rows={4}
          value={values.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Programar ronda
      </button>
    </form>
  );
}