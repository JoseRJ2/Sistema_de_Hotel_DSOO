"use client";

import PendingUnitsCard from "@/components/higiene-alojamiento/cards/PendingUnitsCard";
import type { SuppliesConsumptionFormValues } from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import SectionHeader from "@/components/higiene-alojamiento/shared/SectionHeader";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface StaffCleaningPanelProps {
  units: PendingCleaningUnit[];
  activeUnitId: string | null;
  processingUnitId: string | null;
  onStartCleaning: (unit: PendingCleaningUnit) => Promise<void>;
  onCompleteCleaning: (
    unit: PendingCleaningUnit,
    values: SuppliesConsumptionFormValues
  ) => Promise<void>;
  onCancelActiveUnit: () => void;
}

export default function StaffCleaningPanel({
  units,
  activeUnitId,
  processingUnitId,
  onStartCleaning,
  onCompleteCleaning,
  onCancelActiveUnit,
}: StaffCleaningPanelProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Panel del personal"
        subtitle="Consulta unidades pendientes y ejecuta el ciclo operativo de limpieza."
      />

      <PendingUnitsCard
        units={units}
        activeUnitId={activeUnitId}
        processingUnitId={processingUnitId}
        onStartCleaning={onStartCleaning}
        onCompleteCleaning={onCompleteCleaning}
        onCancelActiveUnit={onCancelActiveUnit}
      />
    </section>
  );
}
