"use client";

import { useState } from "react";

export interface SuppliesConsumptionFormValues {
  toallas: number;
  jabones: number;
  shampoo: number;
  agua: number;
  observaciones: string;
}

interface SuppliesConsumptionFormProps {
  onSubmit?: (values: SuppliesConsumptionFormValues) => void;
}

const initialValues: SuppliesConsumptionFormValues = {
  toallas: 0,
  jabones: 0,
  shampoo: 0,
  agua: 0,
  observaciones: "",
};

export default function SuppliesConsumptionForm({
  onSubmit,
}: SuppliesConsumptionFormProps) {
  const [values, setValues] =
    useState<SuppliesConsumptionFormValues>(initialValues);

  const handleNumberChange = (
    key: keyof Omit<SuppliesConsumptionFormValues, "observaciones">,
    value: string
  ) => {
    try {
      setValues((prev) => ({
        ...prev,
        [key]: Number(value),
      }));
    } catch (error) {
      console.error("Error al actualizar cantidades:", error);
    }
  };

  const handleTextChange = (value: string) => {
    try {
      setValues((prev) => ({
        ...prev,
        observaciones: value,
      }));
    } catch (error) {
      console.error("Error al actualizar observaciones:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      onSubmit?.(values);
    } catch (error) {
      console.error("Error al registrar consumo de insumos:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
            Toallas repuestas
          </label>
          <input
            type="number"
            min={0}
            value={values.toallas}
            onChange={(e) => handleNumberChange("toallas", e.target.value)}
            className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
            Jabones repuestos
          </label>
          <input
            type="number"
            min={0}
            value={values.jabones}
            onChange={(e) => handleNumberChange("jabones", e.target.value)}
            className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
            Shampoo repuesto
          </label>
          <input
            type="number"
            min={0}
            value={values.shampoo}
            onChange={(e) => handleNumberChange("shampoo", e.target.value)}
            className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
            Agua embotellada
          </label>
          <input
            type="number"
            min={0}
            value={values.agua}
            onChange={(e) => handleNumberChange("agua", e.target.value)}
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
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Ej. Se repusieron amenidades completas y se detectó falta de batas."
          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Registrar insumos
      </button>
    </form>
  );
}