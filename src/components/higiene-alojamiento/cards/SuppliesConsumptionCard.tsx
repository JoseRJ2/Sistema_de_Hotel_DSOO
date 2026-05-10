"use client";

import SuppliesConsumptionForm, {
  type SuppliesConsumptionFormValues,
} from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";

interface SuppliesConsumptionCardProps {
  onSubmit?: (values: SuppliesConsumptionFormValues) => void;
}

export default function SuppliesConsumptionCard({
  onSubmit,
}: SuppliesConsumptionCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Reposición y consumo de insumos
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Registra los suministros utilizados o repuestos durante el servicio de
        limpieza.
      </p>

      <div className="mt-5">
        <SuppliesConsumptionForm onSubmit={onSubmit} />
      </div>
    </article>
  );
}