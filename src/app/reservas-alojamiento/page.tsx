'use client';

import { useReservasAlojamiento, TipoCliente } from '@/hooks/useReservasAlojamiento';
import { BedDouble, Plus, ChevronLeft, Eye, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const badgeEstado = (e: string) => ({ CONFIRMADA: 'bg-green-100 text-green-700', PENDIENTE: 'bg-yellow-100 text-yellow-700', CANCELADA: 'bg-red-100 text-red-600', COMPLETADA: 'bg-luxury-champagne text-luxury-charcoal' }[e] ?? 'bg-luxury-champagne text-luxury-charcoal');
const badgeTipo = (t: TipoCliente) => ({ ESTANDAR: 'border-luxury-gold/20 bg-luxury-champagne/40 text-luxury-charcoal', PREMIUM: 'border-amber-300/40 bg-amber-50 text-amber-700', VIP: 'border-purple-200 bg-purple-50 text-purple-700' }[t]);
const etiquetaAloj = (t: string) => t.replace('HABITACION_', 'HAB. ').replace(/_/g, ' ');

export default function ReservasAlojamiento() {
  const { reservas, alojamientos, clientes, reglasUpgrade, vistaActiva, setVistaActiva, reservaSeleccionada, setReservaSeleccionada, mensaje, formCrear, preview, handleChangeCrear, handleSubmitCrear, cancelarReserva, getNombreCliente, getTipoCliente, getNumeroUnidad, getTipoAlojamiento, alojamientosDisponibles, clienteSeleccionado } = useReservasAlojamiento();

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-luxury-black transition-colors"><ArrowLeft size={14} /> Volver al inicio</Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">Gestión hotelera</p>
              <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">Reservas de Alojamiento</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">Crea y gestiona reservas con upgrade temporal automático y políticas de cancelación por tipo de cliente.</p>
            </div>
            <button onClick={() => { setVistaActiva('crear'); setReservaSeleccionada(null); }} className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal transition"><Plus size={16} /> Nueva Reserva</button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[{ l: 'Total', v: reservas.length }, { l: 'Confirmadas', v: reservas.filter(r => r.estado === 'CONFIRMADA').length }, { l: 'Canceladas', v: reservas.filter(r => r.estado === 'CANCELADA').length }, { l: 'Disponibles', v: alojamientos.filter(a => a.estado === 'DISPONIBLE').length }].map(s => (
              <div key={s.l} className="rounded-2xl border border-luxury-gold/15 bg-luxury-champagne/30 px-5 py-4"><p className="font-serif text-3xl font-bold text-luxury-black">{s.v}</p><p className="mt-1 text-xs uppercase tracking-wider text-luxury-charcoal/60">{s.l}</p></div>
            ))}
          </div>
        </header>

        {mensaje && <div className={`rounded-2xl border px-6 py-4 text-sm font-medium ${mensaje.tipo === 'exito' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{mensaje.texto}</div>}

        {vistaActiva === 'lista' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-luxury-champagne/30 text-xs uppercase tracking-wider text-luxury-charcoal/60">
                  <tr><th className="px-6 py-4 text-left">Código</th><th className="px-6 py-4 text-left">Cliente</th><th className="px-6 py-4 text-left">Alojamiento</th><th className="px-6 py-4 text-left">Check-in</th><th className="px-6 py-4 text-left">Check-out</th><th className="px-6 py-4 text-left">Noches</th><th className="px-6 py-4 text-left">Upgrade</th><th className="px-6 py-4 text-left">Total</th><th className="px-6 py-4 text-left">Estado</th><th className="px-6 py-4 text-left">Acc.</th></tr>
                </thead>
                <tbody className="divide-y divide-luxury-gold/10">
                  {reservas.map(r => (
                    <tr key={r.id_reserva} className="hover:bg-luxury-champagne/20 transition">
                      <td className="px-6 py-4 font-mono text-xs">{r.codigo_confirmacion}</td>
                      <td className="px-6 py-4"><p className="font-medium text-luxury-black">{getNombreCliente(r.id_cliente)}</p><span className={`inline-block rounded-full border px-2 py-0.5 text-xs mt-1 ${badgeTipo(getTipoCliente(r.id_cliente))}`}>{getTipoCliente(r.id_cliente)}</span></td>
                      <td className="px-6 py-4"><p className="font-medium">{getNumeroUnidad(r.id_alojamiento)}</p><p className="text-xs text-luxury-charcoal/50">{etiquetaAloj(getTipoAlojamiento(r.id_alojamiento))}</p></td>
                      <td className="px-6 py-4 text-luxury-charcoal/70">{r.fecha_check_in}</td>
                      <td className="px-6 py-4 text-luxury-charcoal/70">{r.fecha_check_out}</td>
                      <td className="px-6 py-4 text-center font-semibold">{r.num_noches}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-luxury-champagne/60 px-3 py-1 text-xs font-semibold">{r.porcentaje_upgrade}%</span></td>
                      <td className="px-6 py-4 font-semibold">${r.costo_total.toLocaleString()}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeEstado(r.estado)}`}>{r.estado}</span></td>
                      <td className="px-6 py-4"><div className="flex gap-2">
                        <button onClick={() => { setReservaSeleccionada(r); setVistaActiva('detalle'); }} className="flex h-8 w-8 items-center justify-center rounded-xl border border-luxury-gold/30 text-luxury-charcoal/60 hover:bg-luxury-champagne"><Eye size={14} /></button>
                        {r.estado !== 'CANCELADA' && r.estado !== 'COMPLETADA' && <button onClick={() => cancelarReserva(r.id_reserva)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"><X size={14} /></button>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vistaActiva === 'crear' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <button onClick={() => setVistaActiva('lista')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-luxury-gold/20 hover:bg-luxury-champagne"><ChevronLeft size={16} /></button>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-black"><BedDouble size={18} className="text-luxury-gold" /></div>
              <div><h2 className="font-serif text-xl text-luxury-black">Nueva Reserva</h2><p className="text-xs text-luxury-charcoal/50">UC-04 a UC-07</p></div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmitCrear} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div><label className="mb-2 block text-sm font-medium">Cliente *</label>
                    <select name="id_cliente" value={formCrear.id_cliente} onChange={handleChangeCrear} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold">
                      <option value="">Seleccione...</option>{clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_completo} ({c.tipo_cliente})</option>)}
                    </select>
                    {clienteSeleccionado && <p className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-medium ${badgeTipo(clienteSeleccionado.tipo_cliente)}`}>{clienteSeleccionado.tipo_cliente}{clienteSeleccionado.tipo_cliente === 'ESTANDAR' && ' — Sin villas'}</p>}
                  </div>
                  <div><label className="mb-2 block text-sm font-medium">Alojamiento *</label>
                    <select name="id_alojamiento" value={formCrear.id_alojamiento} onChange={handleChangeCrear} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold">
                      <option value="">Seleccione...</option>{alojamientosDisponibles(clienteSeleccionado?.tipo_cliente ?? null).map(a => <option key={a.id_alojamiento} value={a.id_alojamiento}>{a.numero_unidad} — {etiquetaAloj(a.tipo)} — ${a.precio_base_noche}/noche</option>)}
                    </select>
                  </div>
                  {['fecha_check_in', 'fecha_check_out'].map(f => (
                    <div key={f}><label className="mb-2 block text-sm font-medium">{f === 'fecha_check_in' ? 'Check-in' : 'Check-out'} *</label>
                      <input type="date" name={f} value={formCrear[f as keyof typeof formCrear]} onChange={handleChangeCrear} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" /></div>
                  ))}
                  <div><label className="mb-2 block text-sm font-medium">Método de Pago *</label>
                    <select name="tipo_pago" value={formCrear.tipo_pago} onChange={handleChangeCrear} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold">
                      <option value="">Seleccione...</option><option value="EFECTIVO">Efectivo</option><option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                    </select>
                  </div>
                </div>
                {preview && (
                  <div className="rounded-2xl border border-luxury-gold/30 bg-luxury-champagne/30 p-6">
                    <p className="mb-3 text-xs uppercase tracking-wider text-luxury-charcoal/60">Resumen</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div><p className="text-xs text-luxury-charcoal/50">Noches</p><p className="mt-1 font-serif text-xl font-bold">{preview.numNoches}</p></div>
                      <div><p className="text-xs text-luxury-charcoal/50">Upgrade</p><p className="mt-1 font-serif text-xl font-bold">{preview.porcentaje}%</p></div>
                      <div><p className="text-xs text-luxury-charcoal/50">Total</p><p className="mt-1 font-serif text-xl font-bold text-luxury-gold">${preview.costoTotal.toLocaleString()}</p></div>
                      <div><p className="text-xs text-luxury-charcoal/50">Tipo</p><p className="mt-1 font-serif text-xl font-bold">{preview.tipoCliente}</p></div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3"><button type="submit" className="flex-1 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal">Confirmar Reserva</button><button type="button" onClick={() => setVistaActiva('lista')} className="rounded-2xl border border-luxury-gold/30 px-6 py-3 text-sm text-luxury-charcoal hover:bg-luxury-champagne/40">Cancelar</button></div>
              </form>
            </div>
          </div>
        )}

        {vistaActiva === 'detalle' && reservaSeleccionada && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <button onClick={() => { setVistaActiva('lista'); setReservaSeleccionada(null); }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-luxury-gold/20 hover:bg-luxury-champagne"><ChevronLeft size={16} /></button>
              <div><h2 className="font-serif text-xl">{reservaSeleccionada.codigo_confirmacion}</h2><p className="text-xs text-luxury-charcoal/50">Detalle — UC-08</p></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[{ l: 'Cliente', v: getNombreCliente(reservaSeleccionada.id_cliente) }, { l: 'Tipo', v: getTipoCliente(reservaSeleccionada.id_cliente) }, { l: 'Alojamiento', v: getNumeroUnidad(reservaSeleccionada.id_alojamiento) }, { l: 'Check-in', v: reservaSeleccionada.fecha_check_in }, { l: 'Check-out', v: reservaSeleccionada.fecha_check_out }, { l: 'Noches', v: reservaSeleccionada.num_noches }, { l: 'Upgrade', v: `${reservaSeleccionada.porcentaje_upgrade}%` }, { l: 'Total', v: `$${reservaSeleccionada.costo_total.toLocaleString()}` }, { l: 'Estado', v: reservaSeleccionada.estado }].map(i => (
                  <div key={i.l} className="rounded-2xl border border-luxury-gold/15 bg-luxury-champagne/20 px-5 py-4"><p className="text-xs uppercase tracking-wider text-luxury-charcoal/50">{i.l}</p><p className="mt-1 font-semibold">{i.v}</p></div>
                ))}
              </div>
              {reservaSeleccionada.estado !== 'CANCELADA' && reservaSeleccionada.estado !== 'COMPLETADA' && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="mb-3 text-sm font-semibold text-red-800">Cancelar reserva</p>
                  <button onClick={() => cancelarReserva(reservaSeleccionada.id_reserva)} className="rounded-2xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Confirmar Cancelación</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
