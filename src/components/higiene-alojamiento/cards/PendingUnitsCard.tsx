"use client";

import SuppliesConsumptionForm, {
  type SuppliesConsumptionFormValues,
} from "@/components/higiene-alojamiento/forms/SuppliesConsumptionForm";
import PriorityBadge from "@/components/higiene-alojamiento/shared/PriorityBadge";
import StatusBadge from "@/components/higiene-alojamiento/shared/StatusBadge";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface PendingUnitsCardProps {
  units: PendingCleaningUnit[];
  activeUnitId: string | null;
  processingUnitId: string | null;
  onStartCleaning?: (unit: PendingCleaningUnit) => Promise<void>;
  onCompleteCleaning?: (
    unit: PendingCleaningUnit,
    values: SuppliesConsumptionFormValues
  ) => Promise<void>;
  onCancelActiveUnit?: () => void;
}

export default function PendingUnitsCard({
  units,
  activeUnitId,
  processingUnitId,
  onStartCleaning,
  onCompleteCleaning,
  onCancelActiveUnit,
}: PendingUnitsCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">Unidades pendientes</h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Vista para personal de limpieza, priorizando villas premium.
      </p>

      {units.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          No hay unidades pendientes en este momento.
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {units.map((unit) => {
          const isActive = activeUnitId === unit.id;
          const isProcessing = processingUnitId === unit.id;
          const canStart = Boolean(unit.reservaId) && !processingUnitId;

          return (
            <div
              key={unit.id}
              className={`rounded-2xl border p-4 transition ${
                isActive
                  ? "border-luxury-gold bg-luxury-champagne/20"
                  : "border-luxury-gold/20 bg-luxury-ivory"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-luxury-black">{unit.nombre}</p>
                  <p className="text-sm text-luxury-charcoal/75">
                    {unit.tipoAlojamiento === "VILLA" ? "Villa" : "Habitacion"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={unit.estado} />
                  <PriorityBadge priority={unit.prioridad} />
                </div>
              </div>

              {unit.horarioSugerido ? (
                <p className="mt-3 text-sm text-luxury-charcoal/75">
                  Horario sugerido:{" "}
                  <span className="font-semibold text-luxury-black">{unit.horarioSugerido}</span>
                </p>
              ) : null}

              {!isActive ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void onStartCleaning?.(unit)}
                    disabled={!canStart}
                    className="rounded-xl bg-luxury-black px-4 py-2 text-sm font-semibold text-luxury-ivory transition hover:opacity-90 disabled:opacity-60"
                  >
                    {unit.reservaId ? "Iniciar limpieza" : "Sin reserva activa"}
                  </button>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-luxury-gold/30 bg-white p-4">
                  <p className="mb-3 text-sm text-luxury-charcoal/80">
                    Registra insumos para esta unidad y finaliza la limpieza.
                  </p>

                  <SuppliesConsumptionForm
                    onSubmit={(values) => {
                      void onCompleteCleaning?.(unit, values);
                    }}
                    isSubmitting={isProcessing}
                    submitLabel={
                      isProcessing
                        ? "Finalizando..."
                        : "Registrar insumos y finalizar limpieza"
                    }
                  />

                  <button
                    type="button"
                    onClick={onCancelActiveUnit}
                    disabled={isProcessing}
                    className="mt-3 rounded-xl border border-luxury-gold/40 bg-white px-4 py-2 text-sm font-semibold text-luxury-black transition hover:bg-luxury-champagne/40 disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
