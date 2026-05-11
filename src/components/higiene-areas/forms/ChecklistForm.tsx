"use client";

import { useState } from "react";
import type { ChecklistTask } from "@/types/higiene-areas/higiene-areas.types";

interface ChecklistFormProps {
  tasks: ChecklistTask[];
  onSubmit?: (tasks: ChecklistTask[]) => void;
}

export default function ChecklistForm({ tasks, onSubmit }: ChecklistFormProps) {
  const [localTasks, setLocalTasks] = useState<ChecklistTask[]>(tasks);

  const toggleTask = (taskId: string) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completada: !task.completada } : task
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(localTasks);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {localTasks.map((task) => (
        <label
          key={task.id}
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-luxury-gold/20 bg-luxury-ivory p-4"
        >
          <input
            type="checkbox"
            checked={task.completada}
            onChange={() => toggleTask(task.id)}
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="block font-semibold text-luxury-black">
              {task.tarea}
            </span>
            <span className="mt-1 block text-sm text-luxury-charcoal/70">
              Marcar cuando la tarea esté completada.
            </span>
          </span>
        </label>
      ))}

      <button
        type="submit"
        className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Guardar checklist
      </button>
    </form>
  );
}