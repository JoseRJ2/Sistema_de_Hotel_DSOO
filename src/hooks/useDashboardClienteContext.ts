"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface RawReserva {
  id_reserva: number;
  id_cliente: number;
  fecha_checkin: string;
  fecha_checkout: string;
  estado: string;
}

function isActiveStatus(status: string): boolean {
  return status === "PENDIENTE" || status === "CONFIRMADA";
}

function pickBestReservaId(
  reservas: RawReserva[],
  clienteId: number
): number | null {
  const ownReservations = reservas.filter(
    (item) => item.id_cliente === clienteId && isActiveStatus(item.estado)
  );

  if (ownReservations.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureOrCurrent = ownReservations.filter((item) => {
    const checkout = new Date(item.fecha_checkout);
    checkout.setHours(0, 0, 0, 0);
    return checkout.getTime() >= today.getTime();
  });

  if (futureOrCurrent.length > 0) {
    return futureOrCurrent.sort(
      (a, b) =>
        new Date(a.fecha_checkin).getTime() - new Date(b.fecha_checkin).getTime()
    )[0]?.id_reserva;
  }

  return ownReservations.sort((a, b) => b.id_reserva - a.id_reserva)[0]
    ?.id_reserva;
}

export function useDashboardClienteContext() {
  const { usuario, cargando: authLoading } = useAuth();
  const [reservaId, setReservaId] = useState<number | null>(null);
  const [loadingReserva, setLoadingReserva] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clienteId = usuario?.id_cliente ?? null;
  const usuarioId = usuario?.id_usuario ?? null;

  useEffect(() => {
    const loadReserva = async () => {
      if (!clienteId) {
        setReservaId(null);
        return;
      }

      try {
        setLoadingReserva(true);
        setError(null);

        const response = await fetch("/api/reservas", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("No fue posible obtener la reserva del cliente.");
        }

        const reservas: RawReserva[] = await response.json();
        setReservaId(pickBestReservaId(reservas, clienteId));
      } catch (requestError) {
        console.error("Error al obtener reserva de contexto de cliente:", requestError);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar la informacion de reservas del cliente."
        );
        setReservaId(null);
      } finally {
        setLoadingReserva(false);
      }
    };

    if (!authLoading) {
      void loadReserva();
    }
  }, [authLoading, clienteId]);

  const loading = authLoading || loadingReserva;

  const sessionReady = useMemo(
    () => Boolean(usuario && clienteId && usuarioId),
    [usuario, clienteId, usuarioId]
  );

  return {
    usuario,
    clienteId,
    usuarioId,
    reservaId,
    loading,
    error,
    sessionReady,
  };
}
