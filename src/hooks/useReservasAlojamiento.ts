'use client';
import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from 'react';

export type TipoCliente = 'ESTANDAR' | 'PREMIUM' | 'VIP';
export interface ReservaAlojamiento {
  id_reserva: number; codigo_confirmacion: string; id_cliente: number; id_alojamiento: number;
  fecha_check_in: string; fecha_check_out: string; num_noches: number;
  precio_base_noche: number; porcentaje_upgrade: number; costo_total: number;
  estado: string; monto_penalizacion: number;
  pago?: { monto: number; tipo_pago: string; estado: string; referencia: string };
}
export interface Alojamiento { id_alojamiento: number; numero_unidad: string; tipo: string; precio_base_noche: number; estado: string; estancia_minima_noches: number; activo: boolean; }
export interface Cliente { id_cliente: number; nombre_completo: string; tipo_cliente: TipoCliente; numero_cliente: string; }
interface ReglaUpgrade { id_regla: number; noches_desde: number; noches_hasta: number; porcentaje_premium: number; porcentaje_vip: number; }

export const useReservasAlojamiento = () => {
  const [reservas, setReservas] = useState<ReservaAlojamiento[]>([]);
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reglasUpgrade, setReglasUpgrade] = useState<ReglaUpgrade[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'crear' | 'detalle'>('lista');
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaAlojamiento | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [formCrear, setFormCrear] = useState({ id_cliente: '', id_alojamiento: '', fecha_check_in: '', fecha_check_out: '', tipo_pago: '' });

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 3500); };

  const cargarDatos = async () => {
    try {
      const [r, a, c, ru] = await Promise.all([
        fetch('/api/reservas').then(r => r.json()),
        fetch('/api/alojamientos').then(r => r.json()),
        fetch('/api/clientes').then(r => r.json()),
        fetch('/api/reglas-upgrade').then(r => r.json()),
      ]);
      if (Array.isArray(r)) setReservas(r.map((res: any) => ({
        ...res,
        precio_base_noche: Number(res.precio_base_noche),
        costo_total: Number(res.costo_total),
        monto_penalizacion: Number(res.monto_penalizacion ?? 0),
        fecha_check_in: res.fecha_check_in?.slice(0, 10) ?? '',
        fecha_check_out: res.fecha_check_out?.slice(0, 10) ?? '',
        pago: res.Pago?.[0] ? { monto: Number(res.Pago[0].monto), tipo_pago: res.Pago[0].tipo_pago, estado: res.Pago[0].estado, referencia: res.Pago[0].referencia } : undefined,
      })));
      if (Array.isArray(a)) setAlojamientos(a.map((al: any) => ({ ...al, numero_unidad: al.numero_o_nombre, precio_base_noche: Number(al.precio_base), estado: al.estado })));
      if (Array.isArray(c)) setClientes(c.map((cl: any) => ({
        id_cliente: cl.id_cliente, nombre_completo: cl.Usuario?.nombre_completo ?? '', numero_cliente: cl.numero_cliente,
        tipo_cliente: (cl.Usuario?.Rol?.nombre?.toUpperCase().includes('VIP') ? 'VIP' : cl.Usuario?.Rol?.nombre?.toUpperCase().includes('PREMIUM') ? 'PREMIUM' : 'ESTANDAR') as TipoCliente,
      })));
      if (Array.isArray(ru)) setReglasUpgrade(ru);
    } catch { /* silent */ }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleChangeCrear = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const { name, value } = e.target; setFormCrear(prev => ({ ...prev, [name]: value })); };

  const preview = useMemo(() => {
    if (!formCrear.id_cliente || !formCrear.id_alojamiento || !formCrear.fecha_check_in || !formCrear.fecha_check_out) return null;
    const aloj = alojamientos.find(a => a.id_alojamiento === Number(formCrear.id_alojamiento));
    const cli = clientes.find(c => c.id_cliente === Number(formCrear.id_cliente));
    if (!aloj || !cli) return null;
    const numNoches = Math.ceil((new Date(formCrear.fecha_check_out).getTime() - new Date(formCrear.fecha_check_in).getTime()) / 86400000);
    if (numNoches < 1) return null;
    const regla = reglasUpgrade.find(r => r.noches_desde <= numNoches && r.noches_hasta >= numNoches);
    const porcentaje = cli.tipo_cliente === 'VIP' ? (regla?.porcentaje_vip ?? 100) : cli.tipo_cliente === 'PREMIUM' ? (regla?.porcentaje_premium ?? 100) : 100;
    return { numNoches, porcentaje, costoTotal: aloj.precio_base_noche * numNoches * (porcentaje / 100), tipoCliente: cli.tipo_cliente, esVilla: aloj.tipo === 'VILLA_PREMIUM' };
  }, [formCrear, alojamientos, clientes, reglasUpgrade]);

  const handleSubmitCrear = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formCrear) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', `✓ Reserva ${data.codigo_confirmacion} confirmada.`);
      setFormCrear({ id_cliente: '', id_alojamiento: '', fecha_check_in: '', fecha_check_out: '', tipo_pago: '' });
      setVistaActiva('lista');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const cancelarReserva = async (id: number) => {
    try {
      const res = await fetch(`/api/reservas/${id}/cancelar`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Reserva cancelada.');
      setVistaActiva('lista');
      setReservaSeleccionada(null);
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const alojamientosDisponibles = (tipo: TipoCliente | null) => alojamientos.filter(a => {
    if (a.estado !== 'DISPONIBLE') return false;
    if (a.tipo === 'VILLA_PREMIUM' && tipo === 'ESTANDAR') return false;
    return true;
  });

  const clienteSeleccionado = clientes.find(c => c.id_cliente === Number(formCrear.id_cliente)) ?? null;
  const getNombreCliente = (id: number) => clientes.find(c => c.id_cliente === id)?.nombre_completo ?? '—';
  const getTipoCliente = (id: number) => clientes.find(c => c.id_cliente === id)?.tipo_cliente ?? 'ESTANDAR';
  const getNumeroUnidad = (id: number) => alojamientos.find(a => a.id_alojamiento === id)?.numero_unidad ?? '—';
  const getTipoAlojamiento = (id: number) => alojamientos.find(a => a.id_alojamiento === id)?.tipo ?? '—';

  return { reservas, alojamientos, clientes, reglasUpgrade, vistaActiva, setVistaActiva, reservaSeleccionada, setReservaSeleccionada, mensaje, formCrear, preview, handleChangeCrear, handleSubmitCrear, cancelarReserva, getNombreCliente, getTipoCliente, getNumeroUnidad, getTipoAlojamiento, alojamientosDisponibles, clienteSeleccionado };
};
