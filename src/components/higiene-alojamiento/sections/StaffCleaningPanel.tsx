"use client";

import PendingUnitsCard from "@/components/higiene-alojamiento/cards/PendingUnitsCard";
import SuppliesConsumptionCard from "@/components/higiene-alojamiento/cards/SuppliesConsumptionCard";
import type { SuppliesConsumptionFormValues } from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import SectionHeader from "@/components/higiene-alojamiento/shared/SectionHeader";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface StaffCleaningPanelProps {
  units: PendingCleaningUnit[];
  onStartCleaning: () => Promise<void>;
  onRegisterSupplies: (values: SuppliesConsumptionFormValues) => Promise<void>;
  onFinishCleaning: () => Promise<void>;
}

export default function StaffCleaningPanel({
  units,
  onStartCleaning,
  onRegisterSupplies,
  onFinishCleaning,
}: StaffCleaningPanelProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Panel del personal"
        subtitle="Consulta unidades pendientes y ejecuta el ciclo operativo de limpieza."
      />

      <PendingUnitsCard
        units={units}
        onStartCleaning={onStartCleaning}
        onFinishCleaning={onFinishCleaning}
      />

      <SuppliesConsumptionCard onSubmit={onRegisterSupplies} />
    </section>
  );
}