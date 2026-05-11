'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BarChart3, TrendingUp, Home, Building2,
  UtensilsCrossed, Smile, RefreshCw, Download, Trophy,
  CalendarDays, DollarSign, BedDouble, Filter, X,
} from 'lucide-react';

/* ─── Filter state type ─────────────────────────────────────────── */
interface Filtros {
  fechaDesde: string;
  fechaHasta: string;
  tipoAloj: string;
  tipoCliente: string;
  estado: string;
}

/* ─── Types ─────────────────────────────────────────────────────── */
interface Reporte {
  resumen: {
    totalReservas: number;
    reservasVilla: number;
    reservasHabitacion: number;
    ingresosVilla: number;
    ingresosHabitacion: number;
    ingresosTotal: number;
    promNochesVilla: number;
    promNochesHabitacion: number;
    totalRestaurante: number;
    totalKids: number;
  };
  villasPorTipoCliente: Record<string, number>;
  ocupacionMensual: { mes: string; villas: number; habitaciones: number; ingresos: number }[];
  rankingVillas: { nombre: string; reservas: number; ingresos: number }[];
  estadosReservas: Record<string, number>;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;
const pct = (part: number, total: number) => total === 0 ? 0 : Math.round((part / total) * 100);

const estadoColor: Record<string, string> = {
  CONFIRMADA: 'bg-green-500',
  PENDIENTE: 'bg-yellow-400',
  CANCELADA: 'bg-red-400',
  COMPLETADA: 'bg-blue-400',
};

const tipoColor: Record<string, string> = {
  VIP: 'bg-purple-500',
  PREMIUM: 'bg-amber-400',
  'ESTÁNDAR': 'bg-slate-400',
  ESTANDAR: 'bg-slate-400',
};

/* ─── Mini bar chart ─────────────────────────────────────────────── */
function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const w = max === 0 ? 0 : Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 shrink-0 text-xs text-luxury-charcoal/60 text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-luxury-champagne/50 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${w}%` }} />
      </div>
      <span className="w-8 shrink-0 text-xs font-semibold text-luxury-charcoal">{value}</span>
    </div>
  );
}

/* ─── Sparkline-style month bars ────────────────────────────────── */
function OcupacionChart({ data }: { data: Reporte['ocupacionMensual'] }) {
  const maxV = Math.max(...data.map(d => d.villas + d.habitaciones), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-2">
      {data.map(d => {
        const total = d.villas + d.habitaciones;
        const hPct = pct(total, maxV);
        const vPct = pct(d.villas, total);
        return (
          <div key={d.mes} className="flex-1 flex flex-col items-center gap-1 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-luxury-black text-white text-[10px] rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-xl">
              <p className="font-semibold mb-1">{d.mes}</p>
              <p>Villas: {d.villas}</p>
              <p>Hab.: {d.habitaciones}</p>
              <p className="text-luxury-gold mt-1">{fmt(d.ingresos)}</p>
            </div>
            <div
              className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-500"
              style={{ height: `${Math.max(hPct, 4)}%` }}
            >
              <div className="bg-luxury-gold/70" style={{ height: `${100 - vPct}%` }} />
              <div className="bg-purple-400/80" style={{ height: `${vPct}%` }} />
            </div>
            <span className="text-[9px] text-luxury-charcoal/50 uppercase">{d.mes}</span>
          </div>
        );
      })}
    </div>
  );
}

const FILTROS_VACIOS: Filtros = { fechaDesde: '', fechaHasta: '', tipoAloj: '', tipoCliente: '', estado: '' };

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ReportesPage() {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [filtrosPendientes, setFiltrosPendientes] = useState<Filtros>(FILTROS_VACIOS);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const filtrosActivos = Object.values(filtros).some(v => v !== '');

  const cargar = useCallback(async (f: Filtros = filtros) => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.fechaDesde)  params.set('fechaDesde',  f.fechaDesde);
      if (f.fechaHasta)  params.set('fechaHasta',  f.fechaHasta);
      if (f.tipoAloj)    params.set('tipoAloj',    f.tipoAloj);
      if (f.tipoCliente) params.set('tipoCliente', f.tipoCliente);
      if (f.estado)      params.set('estado',      f.estado);
      const res = await fetch(`/api/reportes/villas-servicios?${params.toString()}`);
      if (!res.ok) throw new Error('Error al cargar el reporte');
      const data = await res.json();
      setReporte(data);
      setUltimaActualizacion(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  const aplicarFiltros = () => {
    setFiltros(filtrosPendientes);
    setMostrarFiltros(false);
    cargar(filtrosPendientes);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setFiltrosPendientes(FILTROS_VACIOS);
    setMostrarFiltros(false);
    cargar(FILTROS_VACIOS);
  };

  useEffect(() => { cargar(); }, []);

  /* ── Download CSV ──────────────────────────────────────────────── */
  const descargarCSV = () => {
    if (!reporte) return;
    const filas = [
      ['Sección', 'Métrica', 'Valor'],
      ['Resumen', 'Total Reservas', reporte.resumen.totalReservas],
      ['Resumen', 'Reservas Villas', reporte.resumen.reservasVilla],
      ['Resumen', 'Reservas Habitaciones', reporte.resumen.reservasHabitacion],
      ['Ingresos', 'Ingresos Villas', reporte.resumen.ingresosVilla],
      ['Ingresos', 'Ingresos Habitaciones', reporte.resumen.ingresosHabitacion],
      ['Ingresos', 'Ingresos Totales', reporte.resumen.ingresosTotal],
      ['Servicios', 'Reservas Restaurante', reporte.resumen.totalRestaurante],
      ['Servicios', 'Asistencias Kids Club', reporte.resumen.totalKids],
      [],
      ['Ranking Villas', 'Villa', 'Reservas', 'Ingresos'],
      ...reporte.rankingVillas.map((v, i) => [`#${i + 1}`, v.nombre, v.reservas, v.ingresos]),
      [],
      ['Ocupación Mensual', 'Mes', 'Villas', 'Habitaciones', 'Ingresos'],
      ...reporte.ocupacionMensual.map(o => ['', o.mes, o.villas, o.habitaciones, o.ingresos]),
    ];
    const csv = filas.map(f => f.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-villas-servicios-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-luxury-black transition-colors">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        {/* Header */}
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">Analítica</p>
              <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">Reportes de Uso</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-luxury-charcoal/80">
                Estadísticas de ocupación de villas, habitaciones y servicios del resort.
              </p>
              {ultimaActualizacion && (
                <p className="mt-2 text-xs text-luxury-charcoal/40">
                  Actualizado: {ultimaActualizacion.toLocaleTimeString('es-MX')}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                onClick={() => { setFiltrosPendientes(filtros); setMostrarFiltros(v => !v); }}
                className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  filtrosActivos
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-black'
                    : 'border-luxury-gold/30 text-luxury-charcoal hover:bg-luxury-champagne/40'
                }`}
              >
                <Filter size={15} />
                Filtros{filtrosActivos ? ' (activos)' : ''}
              </button>
              {filtrosActivos && (
                <button onClick={limpiarFiltros} className="inline-flex items-center gap-1.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                  <X size={14} /> Limpiar
                </button>
              )}
              <button
                onClick={() => cargar()}
                disabled={cargando}
                className="inline-flex items-center gap-2 rounded-2xl border border-luxury-gold/30 px-5 py-3 text-sm font-semibold text-luxury-charcoal hover:bg-luxury-champagne/40 disabled:opacity-50 transition"
              >
                <RefreshCw size={15} className={cargando ? 'animate-spin' : ''} />
                {cargando ? 'Cargando…' : 'Actualizar'}
              </button>
              <button
                onClick={descargarCSV}
                disabled={!reporte}
                className="inline-flex items-center gap-2 rounded-2xl bg-luxury-black px-5 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal disabled:opacity-40 transition"
              >
                <Download size={15} /> Exportar CSV
              </button>
            </div>
          </div>
        </header>

        {/* ── Panel de Filtros ───────────────────────────────────────── */}
        {mostrarFiltros && (
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg text-luxury-black flex items-center gap-2"><Filter size={16} className="text-luxury-gold" /> Filtrar Reporte</h2>
              <button onClick={() => setMostrarFiltros(false)} className="text-luxury-charcoal/40 hover:text-luxury-black"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-luxury-charcoal/60">Fecha desde</label>
                <input type="date" value={filtrosPendientes.fechaDesde}
                  onChange={e => setFiltrosPendientes(p => ({ ...p, fechaDesde: e.target.value }))}
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-2.5 text-sm focus:border-luxury-gold focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-luxury-charcoal/60">Fecha hasta</label>
                <input type="date" value={filtrosPendientes.fechaHasta}
                  onChange={e => setFiltrosPendientes(p => ({ ...p, fechaHasta: e.target.value }))}
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-2.5 text-sm focus:border-luxury-gold focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-luxury-charcoal/60">Tipo alojamiento</label>
                <select value={filtrosPendientes.tipoAloj}
                  onChange={e => setFiltrosPendientes(p => ({ ...p, tipoAloj: e.target.value }))}
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-2.5 text-sm focus:border-luxury-gold focus:outline-none">
                  <option value="">Todos</option>
                  <option value="VILLA_PREMIUM">Villas</option>
                  <option value="habitacion">Habitaciones</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-luxury-charcoal/60">Tipo de cliente</label>
                <select value={filtrosPendientes.tipoCliente}
                  onChange={e => setFiltrosPendientes(p => ({ ...p, tipoCliente: e.target.value }))}
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-2.5 text-sm focus:border-luxury-gold focus:outline-none">
                  <option value="">Todos</option>
                  <option value="VIP">VIP</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="ESTANDAR">ESTÁNDAR</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-luxury-charcoal/60">Estado</label>
                <select value={filtrosPendientes.estado}
                  onChange={e => setFiltrosPendientes(p => ({ ...p, estado: e.target.value }))}
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-2.5 text-sm focus:border-luxury-gold focus:outline-none">
                  <option value="">Todos</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-3 justify-end">
              <button onClick={limpiarFiltros} className="rounded-2xl border border-luxury-gold/30 px-5 py-2.5 text-sm text-luxury-charcoal hover:bg-luxury-champagne/40 transition">Limpiar</button>
              <button onClick={aplicarFiltros} className="rounded-2xl bg-luxury-black px-6 py-2.5 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal transition">Aplicar filtros</button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-800">{error}</div>
        )}

        {/* Loading skeleton */}
        {cargando && !reporte && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-luxury-champagne/40" />
            ))}
          </div>
        )}

        {reporte && (
          <>
            {/* ── KPI Cards ─────────────────────────────────────────── */}
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: BarChart3, label: 'Total Reservas', value: reporte.resumen.totalReservas, sub: 'alojamiento', color: 'text-luxury-gold' },
                { icon: Building2, label: 'Villas Reservadas', value: reporte.resumen.reservasVilla, sub: `${reporte.resumen.promNochesVilla} noches prom.`, color: 'text-purple-500' },
                { icon: Home, label: 'Habitaciones', value: reporte.resumen.reservasHabitacion, sub: `${reporte.resumen.promNochesHabitacion} noches prom.`, color: 'text-blue-500' },
                { icon: DollarSign, label: 'Ingresos Totales', value: fmt(reporte.resumen.ingresosTotal), sub: 'todas las reservas', color: 'text-green-600' },
                { icon: TrendingUp, label: 'Ingresos Villas', value: fmt(reporte.resumen.ingresosVilla), sub: `${pct(reporte.resumen.ingresosVilla, reporte.resumen.ingresosTotal)}% del total`, color: 'text-purple-500' },
                { icon: BedDouble, label: 'Ingresos Hab.', value: fmt(reporte.resumen.ingresosHabitacion), sub: `${pct(reporte.resumen.ingresosHabitacion, reporte.resumen.ingresosTotal)}% del total`, color: 'text-blue-500' },
                { icon: UtensilsCrossed, label: 'Restaurante', value: reporte.resumen.totalRestaurante, sub: 'reservas de turno', color: 'text-amber-500' },
                { icon: Smile, label: 'Kids Club', value: reporte.resumen.totalKids, sub: 'asistencias', color: 'text-pink-500' },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-2xl border border-luxury-gold/15 bg-white px-5 py-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon size={16} className={kpi.color} />
                    <p className="text-xs uppercase tracking-wider text-luxury-charcoal/50">{kpi.label}</p>
                  </div>
                  <p className="font-serif text-2xl font-bold text-luxury-black">{kpi.value}</p>
                  <p className="mt-1 text-xs text-luxury-charcoal/40">{kpi.sub}</p>
                </div>
              ))}
            </section>

            {/* ── Gráficas ──────────────────────────────────────────── */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Ocupación mensual */}
              <div className="rounded-3xl border border-luxury-gold/20 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-luxury-black">Ocupación Mensual</h2>
                  <CalendarDays size={16} className="text-luxury-charcoal/40" />
                </div>
                <p className="text-xs text-luxury-charcoal/50 mb-4">Últimos 6 meses</p>
                <div className="flex gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-luxury-charcoal/60"><span className="w-3 h-3 rounded-sm bg-purple-400/80 inline-block" /> Villas</span>
                  <span className="flex items-center gap-1.5 text-xs text-luxury-charcoal/60"><span className="w-3 h-3 rounded-sm bg-luxury-gold/70 inline-block" /> Habitaciones</span>
                </div>
                <OcupacionChart data={reporte.ocupacionMensual} />
              </div>

              {/* Villas por tipo de cliente */}
              <div className="rounded-3xl border border-luxury-gold/20 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-luxury-black">Villas por Tipo de Cliente</h2>
                  <Building2 size={16} className="text-luxury-charcoal/40" />
                </div>
                <p className="text-xs text-luxury-charcoal/50 mb-6">Distribución de reservas de villa</p>
                <div className="space-y-4">
                  {Object.entries(reporte.villasPorTipoCliente).length === 0 ? (
                    <p className="text-sm text-luxury-charcoal/40 text-center py-4">Sin datos de villas aún</p>
                  ) : (
                    Object.entries(reporte.villasPorTipoCliente).map(([tipo, count]) => {
                      const total = Object.values(reporte.villasPorTipoCliente).reduce((a, b) => a + b, 0);
                      return (
                        <div key={tipo} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full text-white ${tipoColor[tipo] ?? 'bg-slate-400'}`}>
                              {tipo}
                            </span>
                            <span className="text-xs text-luxury-charcoal/60">{count} reservas · {pct(count, total)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-luxury-champagne/50">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${tipoColor[tipo] ?? 'bg-slate-400'}`}
                              style={{ width: `${pct(count, total)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Ranking villas */}
              <div className="rounded-3xl border border-luxury-gold/20 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-luxury-black">Ranking de Villas</h2>
                  <Trophy size={16} className="text-luxury-gold" />
                </div>
                <p className="text-xs text-luxury-charcoal/50 mb-6">Top 5 villas más reservadas</p>
                <div className="space-y-4">
                  {reporte.rankingVillas.length === 0 ? (
                    <p className="text-sm text-luxury-charcoal/40 text-center py-4">Sin reservas de villas registradas</p>
                  ) : (
                    reporte.rankingVillas.map((v, i) => {
                      const maxR = reporte.rankingVillas[0]?.reservas ?? 1;
                      const medals = ['🥇', '🥈', '🥉'];
                      return (
                        <div key={v.nombre} className="flex items-center gap-3">
                          <span className="text-lg w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-luxury-black truncate">{v.nombre}</span>
                              <span className="text-xs text-luxury-charcoal/50 ml-2 shrink-0">{fmt(v.ingresos)}</span>
                            </div>
                            <MiniBar label="" value={v.reservas} max={maxR} color="bg-purple-400" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Estados de reservas */}
              <div className="rounded-3xl border border-luxury-gold/20 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-lg text-luxury-black">Estado de Reservas</h2>
                  <BarChart3 size={16} className="text-luxury-charcoal/40" />
                </div>
                <p className="text-xs text-luxury-charcoal/50 mb-6">Distribución por estado actual</p>
                <div className="space-y-4">
                  {Object.entries(reporte.estadosReservas).map(([estado, count]) => {
                    const total = Object.values(reporte.estadosReservas).reduce((a, b) => a + b, 0);
                    return (
                      <div key={estado} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${estadoColor[estado] ?? 'bg-slate-400'}`}>
                            {estado}
                          </span>
                          <span className="text-xs text-luxury-charcoal/60">{count} · {pct(count, total)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-luxury-champagne/50">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${estadoColor[estado] ?? 'bg-slate-400'}`}
                            style={{ width: `${pct(count, total)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Servicios */}
                <div className="mt-8 pt-6 border-t border-luxury-gold/10">
                  <p className="text-xs uppercase tracking-wider text-luxury-charcoal/50 mb-4">Uso de Servicios</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-amber-50 border border-amber-200/50 p-4 text-center">
                      <UtensilsCrossed size={20} className="text-amber-500 mx-auto mb-2" />
                      <p className="font-serif text-2xl font-bold text-luxury-black">{reporte.resumen.totalRestaurante}</p>
                      <p className="text-xs text-luxury-charcoal/50 mt-1">Restaurante</p>
                    </div>
                    <div className="rounded-2xl bg-pink-50 border border-pink-200/50 p-4 text-center">
                      <Smile size={20} className="text-pink-500 mx-auto mb-2" />
                      <p className="font-serif text-2xl font-bold text-luxury-black">{reporte.resumen.totalKids}</p>
                      <p className="text-xs text-luxury-charcoal/50 mt-1">Kids Club</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
