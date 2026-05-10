import CleaningStatusCard from "@/components/higiene-alojamiento/cards/CleaningStatusCard";
import SectionHeader from "@/components/higiene-alojamiento/shared/SectionHeader";
import type { CleaningTimelineItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface CleaningTimelineSectionProps {
  items: CleaningTimelineItem[];
}

export default function CleaningTimelineSection({
  items,
}: CleaningTimelineSectionProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Seguimiento del servicio"
        subtitle="Visualiza el estado actual del ciclo de higiene."
      />
      <CleaningStatusCard items={items} />
    </section>
  );
}