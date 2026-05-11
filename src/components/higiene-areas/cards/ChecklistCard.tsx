"use client";

import ChecklistForm from "@/components/higiene-areas/forms/ChecklistForm";
import type { ChecklistTask } from "@/types/higiene-areas/higiene-areas.types";

interface ChecklistCardProps {
  tasks: ChecklistTask[];
  onSubmit?: (tasks: ChecklistTask[]) => void;
}

export default function ChecklistCard({ tasks, onSubmit }: ChecklistCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Checklist digital
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Registra las tareas realizadas antes de liberar el área.
      </p>

      <div className="mt-5">
        <ChecklistForm tasks={tasks} onSubmit={onSubmit} />
      </div>
    </article>
  );
}