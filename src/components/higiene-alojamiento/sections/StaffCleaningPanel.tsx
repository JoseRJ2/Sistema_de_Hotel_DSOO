"use client";

import PendingUnitsCard from "@/components/higiene-alojamiento/cards/PendingUnitsCard";
import SuppliesConsumptionCard from "@/components/higiene-alojamiento/cards/SuppliesConsumptionCard";
import type { SuppliesConsumptionFormValues } from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import SectionHeader from "@/components/higiene-alojamiento/shared/SectionHeader";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface StaffCleaningPanelProps {
  units: PendingCleaningUnit[];
}

export default function StaffCleaningPanel({
  units,
}: StaffCleaningPanelProps) {
  const handleSuppliesSubmit = (values: SuppliesConsumptionFormValues) => {
    try {
      console.log("Insumos registrados:", values);
    } catch (error) {
      console.error("Error al registrar insumos:", error);
    }
  };

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Panel del personal"
        subtitle="Consulta unidades pendientes y prioridades operativas."
      />

      <PendingUnitsCard units={units} />

      <SuppliesConsumptionCard onSubmit={handleSuppliesSubmit} />
    </section>
  );
}