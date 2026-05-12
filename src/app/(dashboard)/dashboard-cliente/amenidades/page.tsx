"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AmenityItem } from "@/types/reserva-amenidades/reserva-amenidades.types";
import { useDashboardClienteContext } from "@/hooks/useDashboardClienteContext";

type ClientLevel = "ESTANDAR" | "PREMIUM" | "VIP";

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

interface StayDateRange {
  minDate: string;
  maxDate: string;
}

interface ReservationFormState {
  fecha: string;
  horarioId: string;
  invitados: number;
  comentarios: string;
}

interface FeedbackState {
  title: string;
  message: string;
  variant: "success" | "info" | "warning";
}

interface ReservationReminderContext {
  clienteId: number;
  areaId: number;
  horarioId: number;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  amenidadNombre: string;
}

interface CalendarReminderState {
  status: "idle" | "loading" | "success" | "warning";
  message?: string;
  htmlLink?: string;
}

const initialForm: ReservationFormState = {
  fecha: "",
  horarioId: "",
  invitados: 1,
  comentarios: "",
};

function parseClientLevel(rawRole: string): ClientLevel {
  const role = rawRole.toUpperCase();
  if (role.includes("VIP")) return "VIP";
  if (role.includes("PREMIUM")) return "PREMIUM";
  return "ESTANDAR";
}

function toDateInput(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().split("T")[0];
}

function getTodayInputDate(): string {
  return toDateInput(new Date());
}

function normalizeDayToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase();
}

function getDayTokenFromDate(dateInput: string): string {
  if (!dateInput) return "";

  const date = new Date(`${dateInput}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  const daysByIndex = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];

  return daysByIndex[date.getDay()] ?? "";
}

export default function AmenidadesDetallePage() {
  const { usuario, clienteId, reservaId, loading: contextLoading, sessionReady } =
    useDashboardClienteContext();
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  const [clientLevel, setClientLevel] = useState<ClientLevel>("ESTANDAR");
  const [stayDateRange, setStayDateRange] = useState<StayDateRange>({
    minDate: getTodayInputDate(),
    maxDate: "",
  });
  const [expandedAmenityId, setExpandedAmenityId] = useState<string | null>(null);
  const [schedulesByAmenity, setSchedulesByAmenity] = useState<
    Record<string, BackendSchedule[]>
  >({});
  const [loadingSchedulesFor, setLoadingSchedulesFor] = useState<string | null>(
    null
  );
  const [reservationForm, setReservationForm] =
    useState<ReservationFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [lastReservation, setLastReservation] =
    useState<ReservationReminderContext | null>(null);
  const [calendarReminder, setCalendarReminder] = useState<CalendarReminderState>(
    {
      status: "idle",
    }
  );

  const canAccessAmenity = useCallback(
    (amenity: AmenityItem) => {
      if (!amenity.accesoVip) return true;
      return clientLevel === "VIP";
    },
    [clientLevel]
  );

  const canAccessSchedule = useCallback(
    (schedule: BackendSchedule) => {
      if (schedule.exclusivoVip) {
        return clientLevel === "VIP";
      }

      if (schedule.exclusivoPremium) {
        return clientLevel === "PREMIUM" || clientLevel === "VIP";
      }

      return true;
    },
    [clientLevel]
  );

  const loadDashboardAmenidades = useCallback(async () => {
    try {
      setIsLoading(true);

      const [catalogRes, stayRes] = await Promise.all([
        fetch("/api/reserva-amenidades/catalogo", { cache: "no-store" }),
        reservaId
          ? fetch(`/api/higiene-alojamiento/resumen/${reservaId}`, {
              cache: "no-store",
            })
          : Promise.resolve(null),
      ]);

      if (catalogRes.ok) {
        const catalogData: AmenityItem[] = await catalogRes.json();
        setAmenities(catalogData);
      }

      if (stayRes?.ok) {
        const stayData = await stayRes.json();
        const minDate = toDateInput(stayData.fechaCheckin);
        const maxDate = toDateInput(stayData.fechaCheckout);

        setClientLevel(parseClientLevel(stayData.rolCliente ?? "ESTANDAR"));
        setStayDateRange({
          minDate: minDate || getTodayInputDate(),
          maxDate,
        });
      } else {
        const fallbackClientLevel = usuario?.tipo_cliente ?? "ESTANDAR";
        setClientLevel(parseClientLevel(fallbackClientLevel));
        setStayDateRange((prev) => ({
          minDate: prev.minDate || getTodayInputDate(),
          maxDate: prev.maxDate,
        }));
      }
    } catch (error) {
      console.error("Error al cargar amenidades del dashboard:", error);
      setFeedback({
        title: "Error",
        message: "No fue posible cargar las amenidades disponibles.",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  }, [reservaId, usuario]);

  useEffect(() => {
    if (!contextLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadDashboardAmenidades();
    }
  }, [contextLoading, loadDashboardAmenidades]);

  const visibleAmenities = useMemo(
    () =>
      amenities.filter(
        (item) =>
          item.estado?.toUpperCase() === "DISPONIBLE" && canAccessAmenity(item)
      ),
    [amenities, canAccessAmenity]
  );

  const selectedDayToken = useMemo(
    () => getDayTokenFromDate(reservationForm.fecha),
    [reservationForm.fecha]
  );

  const expandedSchedules = useMemo(() => {
    if (!expandedAmenityId) return [];

    const schedules = schedulesByAmenity[expandedAmenityId] ?? [];
    const schedulesByLevel = schedules.filter(canAccessSchedule);

    if (!selectedDayToken) return schedulesByLevel;

    return schedulesByLevel.filter((schedule) => {
      const scheduleDay = normalizeDayToken(schedule.diaSemana);

      return (
        scheduleDay === selectedDayToken ||
        scheduleDay === "TODOS" ||
        scheduleDay === "DIARIO"
      );
    });
  }, [
    expandedAmenityId,
    schedulesByAmenity,
    canAccessSchedule,
    selectedDayToken,
  ]);

  const loadSchedules = async (amenityId: string) => {
    try {
      setLoadingSchedulesFor(amenityId);

      const response = await fetch(`/api/reserva-amenidades/horarios/${amenityId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible obtener los horarios de la amenidad.");
      }

      const schedules: BackendSchedule[] = await response.json();

      setSchedulesByAmenity((prev) => ({
        ...prev,
        [amenityId]: schedules,
      }));
    } catch (error) {
      console.error("Error al cargar horarios de amenidad:", error);
      setFeedback({
        title: "Error",
        message: "No fue posible cargar los horarios de esta amenidad.",
        variant: "warning",
      });
    } finally {
      setLoadingSchedulesFor(null);
    }
  };

  const handleToggleAmenity = async (amenityId: string) => {
    try {
      if (expandedAmenityId === amenityId) {
        setExpandedAmenityId(null);
        setReservationForm(initialForm);
        return;
      }

      setExpandedAmenityId(amenityId);
      setReservationForm({
        ...initialForm,
        fecha: stayDateRange.minDate,
      });

      if (!schedulesByAmenity[amenityId]) {
        await loadSchedules(amenityId);
      }
    } catch (error) {
      console.error("Error al seleccionar amenidad:", error);
    }
  };

  const handleFormChange = (
    key: keyof ReservationFormState,
    value: string | number
  ) => {
    setReservationForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReserve = async (amenity: AmenityItem) => {
    try {
      if (!clienteId) {
        setFeedback({
          title: "Sesion requerida",
          message: "Inicia sesion como cliente para reservar amenidades.",
          variant: "warning",
        });
        return;
      }

      const selectedSchedule = expandedSchedules.find(
        (schedule) => schedule.id === reservationForm.horarioId
      );

      if (!reservationForm.fecha || !reservationForm.horarioId) {
        setFeedback({
          title: "Datos incompletos",
          message: "Selecciona fecha y horario para confirmar tu reserva.",
          variant: "warning",
        });
        return;
      }

      if (!selectedSchedule) {
        setFeedback({
          title: "Horario invalido",
          message: "Selecciona un horario valido para continuar.",
          variant: "warning",
        });
        return;
      }

      if (
        reservationForm.invitados < 1 ||
        reservationForm.invitados > amenity.capacidad
      ) {
        setFeedback({
          title: "Cantidad invalida",
          message: `La reserva permite entre 1 y ${amenity.capacidad} personas.`,
          variant: "warning",
        });
        return;
      }

      if (
        stayDateRange.minDate &&
        reservationForm.fecha < stayDateRange.minDate
      ) {
        setFeedback({
          title: "Fecha invalida",
          message: `La fecha debe ser igual o posterior a ${stayDateRange.minDate}.`,
          variant: "warning",
        });
        return;
      }

      if (
        stayDateRange.maxDate &&
        reservationForm.fecha > stayDateRange.maxDate
      ) {
        setFeedback({
          title: "Fecha invalida",
          message: `La fecha debe ser igual o anterior a ${stayDateRange.maxDate}.`,
          variant: "warning",
        });
        return;
      }

      setIsSubmitting(true);

      const response = await fetch("/api/reserva-amenidades/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteId,
          areaId: Number(amenity.id),
          horarioId: Number(reservationForm.horarioId),
          fechaReserva: reservationForm.fecha,
          cantidadPersonas: reservationForm.invitados,
          observaciones: reservationForm.comentarios,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ??
            "No fue posible confirmar la reserva de amenidad."
        );
      }

      setFeedback({
        title: "Reserva confirmada",
        message:
          "Tu reservacion fue creada. Si lo deseas, ahora puedes agregar un recordatorio a Google Calendar.",
        variant: "success",
      });

      setLastReservation({
        clienteId,
        areaId: Number(amenity.id),
        horarioId: Number(selectedSchedule.id),
        fechaReserva: reservationForm.fecha,
        horaInicio: selectedSchedule.horaInicio,
        horaFin: selectedSchedule.horaFin,
        amenidadNombre: amenity.nombre,
      });
      setCalendarReminder({ status: "idle" });

      setExpandedAmenityId(null);
      setReservationForm(initialForm);
      await loadDashboardAmenidades();
    } catch (error) {
      console.error("Error al reservar amenidad:", error);
      setFeedback({
        title: "No se pudo completar la reserva",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrio un error al reservar la amenidad.",
        variant: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoogleCalendarReminder = async () => {
    try {
      if (!lastReservation) return;

      setCalendarReminder({
        status: "loading",
        message: "Creando recordatorio en Google Calendar...",
      });

      const response = await fetch("/api/reserva-amenidades/recordatorio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lastReservation),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.message ?? "No fue posible crear el recordatorio."
        );
      }

      setCalendarReminder({
        status: "success",
        message:
          body?.message ??
          "Recordatorio agregado. Puedes revisarlo en Google Calendar.",
        htmlLink: body?.htmlLink,
      });
    } catch (error) {
      console.error("Error al crear recordatorio de Google Calendar:", error);
      setCalendarReminder({
        status: "warning",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible agregar el recordatorio.",
      });
    }
  };

  if (contextLoading) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando sesion del cliente...
          </div>
        </div>
      </main>
    );
  }

  if (!sessionReady || !usuario) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl text-luxury-black">
              Acceso restringido
            </h1>
            <p className="mt-2 text-luxury-charcoal/70">
              Inicia sesion como cliente para ver y reservar amenidades.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-luxury-black px-5 py-2 text-sm font-semibold text-luxury-ivory"
            >
              Ir a iniciar sesion
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/dashboard-cliente"
          className="text-sm font-semibold text-luxury-gold"
        >
          Volver al dashboard
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">
            Mis amenidades disponibles
          </h1>
          <p className="mt-2 text-luxury-charcoal/70">
            Selecciona una amenidad para reservarla en esta misma pantalla.
          </p>
          <p className="mt-3 text-sm text-luxury-charcoal/70">
            Nivel detectado: <span className="font-semibold">{clientLevel}</span>
          </p>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando catalogo de amenidades...
          </div>
        ) : null}

        {feedback ? (
          <div
            className={`rounded-2xl border p-4 text-sm shadow-sm ${
              feedback.variant === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : feedback.variant === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-luxury-gold/30 bg-luxury-champagne/35 text-luxury-black"
            }`}
          >
            <p className="font-semibold">{feedback.title}</p>
            <p className="mt-1 opacity-90">{feedback.message}</p>
          </div>
        ) : null}

        {lastReservation ? (
          <section className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-luxury-black">
              Recordatorio de reserva
            </h2>
            <p className="mt-2 text-sm text-luxury-charcoal/75">
              Reserva confirmada para {lastReservation.amenidadNombre} el{" "}
              {lastReservation.fechaReserva} de{" "}
              {lastReservation.horaInicio.slice(0, 5)} a{" "}
              {lastReservation.horaFin.slice(0, 5)}.
            </p>
            <p className="mt-1 text-sm text-luxury-charcoal/75">
              Puedes agregar un recordatorio a Google Calendar para no olvidar tu
              horario.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleCreateGoogleCalendarReminder()}
                disabled={calendarReminder.status === "loading"}
                className="rounded-xl bg-luxury-gold px-5 py-2 text-sm font-semibold text-luxury-black transition hover:bg-luxury-gold/85 disabled:opacity-60"
              >
                {calendarReminder.status === "loading"
                  ? "Agregando..."
                  : "Agregar recordatorio a Google Calendar"}
              </button>

              {calendarReminder.htmlLink ? (
                <a
                  href={calendarReminder.htmlLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-luxury-gold/40 px-4 py-2 text-sm font-semibold text-luxury-black hover:bg-luxury-champagne/30"
                >
                  Abrir en Google Calendar
                </a>
              ) : null}
            </div>

            {calendarReminder.message ? (
              <p
                className={`mt-3 text-sm ${
                  calendarReminder.status === "success"
                    ? "text-emerald-700"
                    : calendarReminder.status === "warning"
                      ? "text-amber-700"
                      : "text-luxury-charcoal/75"
                }`}
              >
                {calendarReminder.message}
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2">
          {visibleAmenities.map((amenity) => {
            const isExpanded = expandedAmenityId === amenity.id;

            return (
              <article
                key={amenity.id}
                className={`rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                  isExpanded
                    ? "border-luxury-gold shadow-md"
                    : "border-luxury-gold/25"
                }`}
              >
                <h2 className="font-serif text-3xl text-luxury-black">
                  {amenity.nombre}
                </h2>
                <p className="mt-2 text-luxury-charcoal/70">
                  {amenity.descripcion}
                </p>
                <p className="mt-4 text-sm text-luxury-charcoal/70">
                  {amenity.tipo} · Capacidad: {amenity.capacidad} personas
                </p>

                <button
                  type="button"
                  onClick={() => void handleToggleAmenity(amenity.id)}
                  className="mt-5 rounded-xl bg-luxury-black px-5 py-2 text-sm font-semibold text-luxury-ivory transition hover:opacity-90"
                >
                  {isExpanded ? "Cerrar" : "Seleccionar y reservar"}
                </button>

                {isExpanded ? (
                  <div className="mt-6 rounded-2xl border border-luxury-gold/25 bg-luxury-champagne/20 p-4 space-y-4">
                    <p className="text-sm text-luxury-charcoal/80">
                      Elige fecha y horario. El sistema validara cupo y buffer VIP
                      al confirmar la reservacion.
                    </p>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                        Fecha
                      </label>
                      <input
                        type="date"
                        min={stayDateRange.minDate}
                        max={stayDateRange.maxDate || undefined}
                        value={reservationForm.fecha}
                        onChange={(event) =>
                          setReservationForm((prev) => ({
                            ...prev,
                            fecha: event.target.value,
                            horarioId: "",
                          }))
                        }
                        className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
                      />
                      <p className="mt-1 text-xs text-luxury-charcoal/70">
                        Rango de tu estancia: {stayDateRange.minDate}
                        {stayDateRange.maxDate
                          ? ` a ${stayDateRange.maxDate}`
                          : ""}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                        Horario
                      </label>
                      {loadingSchedulesFor === amenity.id ? (
                        <div className="rounded-xl border border-luxury-gold/20 bg-white px-4 py-3 text-sm text-luxury-charcoal/75">
                          Cargando horarios...
                        </div>
                      ) : expandedSchedules.length === 0 ? (
                        <div className="rounded-xl border border-luxury-gold/20 bg-white px-4 py-3 text-sm text-luxury-charcoal/75">
                          No hay horarios disponibles para la fecha elegida.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {expandedSchedules.map((schedule) => {
                            const isSelected =
                              reservationForm.horarioId === schedule.id;

                            return (
                              <button
                                key={schedule.id}
                                type="button"
                                onClick={() =>
                                  handleFormChange("horarioId", schedule.id)
                                }
                                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                                  isSelected
                                    ? "border-luxury-gold bg-luxury-gold/10"
                                    : "border-luxury-gold/25 bg-white hover:border-luxury-gold/60"
                                }`}
                              >
                                <p className="text-sm font-semibold text-luxury-black">
                                  {schedule.diaSemana} · {schedule.horaInicio} -{" "}
                                  {schedule.horaFin}
                                </p>
                                <p className="mt-1 text-xs text-luxury-charcoal/70">
                                  Cupo base: {schedule.cupoBase}
                                  {clientLevel === "VIP" && schedule.bufferVip > 0
                                    ? ` + buffer VIP ${schedule.bufferVip}`
                                    : ""}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                          Personas
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={amenity.capacidad}
                          value={reservationForm.invitados}
                          onChange={(event) => {
                            const rawValue = Number(event.target.value);
                            const normalized = Number.isNaN(rawValue)
                              ? 1
                              : Math.max(
                                  1,
                                  Math.min(rawValue, amenity.capacidad)
                                );

                            handleFormChange("invitados", normalized);
                          }}
                          className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                        Observaciones
                      </label>
                      <textarea
                        value={reservationForm.comentarios}
                        onChange={(event) =>
                          handleFormChange("comentarios", event.target.value)
                        }
                        rows={3}
                        className="w-full rounded-xl border border-luxury-gold/30 bg-white px-4 py-3 outline-none focus:border-luxury-gold"
                        placeholder="Ej. Reserva para celebrar aniversario."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleReserve(amenity)}
                      disabled={isSubmitting || loadingSchedulesFor === amenity.id}
                      className="rounded-xl bg-luxury-gold px-5 py-3 text-sm font-semibold text-luxury-black transition hover:bg-luxury-gold/85 disabled:opacity-60"
                    >
                      {isSubmitting ? "Confirmando..." : "Confirmar reservacion"}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        {!isLoading && visibleAmenities.length === 0 ? (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white p-8 text-sm text-luxury-charcoal/80">
            No hay amenidades disponibles para tu tipo de cliente en este momento.
          </div>
        ) : null}
      </div>
    </main>
  );
}
