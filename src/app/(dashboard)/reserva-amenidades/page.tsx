"use client";

import { useCallback, useEffect, useState } from "react";
import AmenityCatalogCard from "@/components/reserva-amenidades/cards/AmenityCatalogCard";
import AmenityReservationPanel from "@/components/reserva-amenidades/sections/AmenityReservationPanel";
import SectionHeader from "@/components/reserva-amenidades/shared/SectionHeader";
import type {
  AmenityItem,
  ReservationFormValues,
  ReservationSummary,
} from "@/types/reserva-amenidades/reserva-amenidades.types";

const CLIENTE_ID = 1;
const CLIENT_LEVEL = "VIP";

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

interface BackendAmenity {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  capacidad: number;
  estado: string;
  requiereReservacion: boolean;
  accesoVip: boolean;
}

interface BackendSchedule {
  id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoBase: number;
  bufferVip: number;
  exclusivoPremium: boolean;
  exclusivoVip: boolean;
}

export default function ReservaAmenidadesPage() {
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityItem | null>(
    null
  );
  const [summary, setSummary] = useState<ReservationSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const showFeedback = (
    title: string,
    message: string,
    variant: FeedbackState["variant"] = "info"
  ) => {
    setFeedback({ title, message, variant });
  };

  useEffect(() => {
    if (!feedback) return;

    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [feedback]);

  const loadCatalog = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/reserva-amenidades/catalogo", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible obtener el catálogo.");
      }

      const catalog: BackendAmenity[] = await response.json();

      const catalogWithSchedules: AmenityItem[] = await Promise.all(
        catalog.map(async (amenity) => {
          const scheduleResponse = await fetch(
            `/api/reserva-amenidades/horarios/${amenity.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const schedules: BackendSchedule[] = scheduleResponse.ok
            ? await scheduleResponse.json()
            : [];

          return {
            id: amenity.id,
            nombre: amenity.nombre,
            tipo: amenity.tipo,
            descripcion: amenity.descripcion,
            capacidad: amenity.capacidad,
            estado: amenity.estado,
            horarioDisponible: schedules.map((schedule) => ({
              horarioId: schedule.id,
              horarioLabel: `${schedule.horaInicio} - ${schedule.horaFin}`,
            })),
            requiereReservacion: amenity.requiereReservacion,
            accesoVip: amenity.accesoVip,
          };
        })
      );

      setAmenities(catalogWithSchedules);
    } catch (error) {
      console.error("Error cargando catálogo de amenidades:", error);
      showFeedback(
        "Error",
        "No fue posible cargar el catálogo de amenidades.",
        "warning"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const handleReserve = async (values: ReservationFormValues) => {
    if (!selectedAmenity) return;

    try {
      const response = await fetch("/api/reserva-amenidades/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteId: CLIENTE_ID,
          areaId: Number(selectedAmenity.id),
          horarioId: Number(values.horarioId),
          fechaReserva: values.fecha,
          cantidadPersonas: values.invitados,
          observaciones: values.comentarios,
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible confirmar la reserva.");
      }

      setSummary({
        amenidad: selectedAmenity.nombre,
        fecha: values.fecha,
        horario: values.horarioLabel,
        invitados: values.invitados,
        nivelCliente: CLIENT_LEVEL,
        estado: "CONFIRMADA",
      });

      showFeedback(
        "Reserva confirmada",
        "La amenidad fue reservada correctamente.",
        "success"
      );

      await loadCatalog();
    } catch (error) {
      console.error("Error reservando amenidad:", error);

      showFeedback(
        "Error",
        "No fue posible confirmar la reserva de amenidad.",
        "warning"
      );
    }
  };

  const handleSelectAmenity = (amenity: AmenityItem) => {
    setSelectedAmenity(amenity);
    setSummary(null);
  };

  const handleClearSelection = () => {
    setSelectedAmenity(null);
    setSummary(null);
  };

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-[2.5rem] border border-luxury-gold/20 bg-white p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-luxury-charcoal/60">
            Gestión hotelera
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-tight text-luxury-black md:text-7xl">
            Reserva de amenidades
          </h1>

          <p className="mt-6 max-w-4xl text-base leading-8 text-luxury-charcoal/80">
            Consulta amenidades disponibles, valida privilegios VIP y administra
            reservas para experiencias exclusivas dentro del resort.
          </p>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm">
              Cargando catálogo de amenidades...
            </div>
          ) : null}

          {feedback ? (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm shadow-sm ${
                feedback.variant === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : feedback.variant === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-luxury-gold/30 bg-luxury-champagne/35 text-luxury-black"
              }`}
            >
              <p className="font-semibold">{feedback.title}</p>
              <p className="mt-1 opacity-85">{feedback.message}</p>
            </div>
          ) : null}
        </header>

        {!selectedAmenity ? (
          <>
            <SectionHeader
              title="Catálogo de amenidades"
              subtitle="Selecciona una experiencia y continúa con la reservación."
            />

            <div className="grid gap-8 lg:grid-cols-2">
              {amenities.map((amenity) => (
                <AmenityCatalogCard
                  key={amenity.id}
                  amenity={amenity}
                  onSelect={handleSelectAmenity}
                />
              ))}
            </div>

            {!isLoading && amenities.length === 0 ? (
              <div className="rounded-3xl border border-luxury-gold/20 bg-white p-8 text-sm text-luxury-charcoal/80">
                No hay amenidades disponibles para reservar.
              </div>
            ) : null}
          </>
        ) : (
          <AmenityReservationPanel
            amenity={selectedAmenity}
            summary={summary}
            onReserve={handleReserve}
            onClearSelection={handleClearSelection}
          />
        )}
      </div>
    </main>
  );
}