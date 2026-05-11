"use client";

import AreaScheduleCard from "@/components/higiene-areas/cards/AreaScheduleCard";
import AreaSummaryCard from "@/components/higiene-areas/cards/AreaSummaryCard";
import HygieneSealCard from "@/components/higiene-areas/cards/HygieneSealCard";
import SectionHeader from "@/components/higiene-areas/shared/SectionHeader";
import type {
  AreaComunItem,
  AreaScheduleFormValues,
} from "@/types/higiene-areas/higiene-areas.types";

interface AreaManagementPanelProps {
  areas: AreaComunItem[];
  selectedArea: AreaComunItem | null;
  onSelectArea: (area: AreaComunItem) => void;
  onScheduleArea: (values: AreaScheduleFormValues) => void;
}

export default function AreaManagementPanel({
  areas,
  selectedArea,
  onSelectArea,
  onScheduleArea,
}: AreaManagementPanelProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Gestión de áreas públicas"
        subtitle="Consulta zonas, rondas y estado operativo de higiene."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {areas.map((area) => (
          <AreaSummaryCard
            key={area.id}
            area={area}
            onSelect={onSelectArea}
          />
        ))}
      </div>

      <AreaScheduleCard areas={areas} onSubmit={onScheduleArea} />

      {selectedArea ? (
        <HygieneSealCard visible={selectedArea.selloHigieneVisible} />
      ) : null}
    </section>
  );
}