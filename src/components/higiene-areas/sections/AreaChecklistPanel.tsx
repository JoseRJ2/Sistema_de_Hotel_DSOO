"use client";

import ChecklistCard from "@/components/higiene-areas/cards/ChecklistCard";
import SectionHeader from "@/components/higiene-areas/shared/SectionHeader";
import type {
  AreaComunItem,
  ChecklistTask,
} from "@/types/higiene-areas/higiene-areas.types";

interface AreaChecklistPanelProps {
  selectedArea: AreaComunItem | null;
  tasks: ChecklistTask[];
  onSubmitChecklist: (tasks: ChecklistTask[]) => void;
  onStartArea: () => void;
  onFinishArea: () => void;
}

export default function AreaChecklistPanel({
  selectedArea,
  tasks,
  onSubmitChecklist,
  onStartArea,
  onFinishArea,
}: AreaChecklistPanelProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Operación de higiene"
        subtitle="Inicia, valida y finaliza la atención del área seleccionada."
      />

      <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
        <h3 className="font-serif text-2xl text-luxury-black">
          Área seleccionada
        </h3>

        <p className="mt-2 text-sm text-luxury-charcoal/80">
          {selectedArea
            ? selectedArea.nombre
            : "Selecciona un área para operar el checklist."}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!selectedArea}
            onClick={onStartArea}
            className="rounded-xl bg-luxury-black px-5 py-3 text-sm font-semibold text-luxury-ivory transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Iniciar higiene
          </button>

          <button
            type="button"
            disabled={!selectedArea}
            onClick={onFinishArea}
            className="rounded-xl border border-luxury-gold/40 bg-white px-5 py-3 text-sm font-semibold text-luxury-black transition hover:bg-luxury-champagne/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Liberar área
          </button>
        </div>
      </article>

      <ChecklistCard tasks={tasks} onSubmit={onSubmitChecklist} />
    </section>
  );
}