'use client';

import { useTiposClientes, TipoCliente } from '@/hooks/useTiposClientes';
import { Users, Crown, Star, Plus, RefreshCw, ClipboardList, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const badgeTipo = (t: TipoCliente) => ({ ESTANDAR: 'border-luxury-gold/20 bg-luxury-champagne/40 text-luxury-charcoal', PREMIUM: 'border-amber-300/40 bg-amber-50 text-amber-700', VIP: 'border-purple-200 bg-purple-50 text-purple-700' }[t]);
const badgeMem = (e: string) => ({ ACTIVA: 'bg-green-100 text-green-700', VENCIDA: 'bg-red-100 text-red-600', CANCELADA: 'bg-luxury-champagne text-luxury-charcoal' }[e] ?? 'bg-luxury-champagne text-luxury-charcoal');
const iconTipo = (t: TipoCliente) => ({ ESTANDAR: <Users size={14} />, PREMIUM: <Star size={14} />, VIP: <Crown size={14} /> }[t]);

export default function TiposClientes() {
  const { clientes, beneficios, auditoria, tarifas, vistaActiva, setVistaActiva, mensaje, formRegistrar, formMembresia, costoPreview, clienteMembresia, handleChangeRegistrar, handleSubmitRegistrar, handleChangeMembresia, handleSubmitMembresia, verificarExpiraciones, getBeneficiosPorTipo } = useTiposClientes();

  const tabs = [{ key: 'lista', label: 'Clientes', icon: Users }, { key: 'registrar', label: 'Registrar', icon: Plus }, { key: 'membresia', label: 'Membresía', icon: Crown }, { key: 'beneficios', label: 'Beneficios', icon: Star }, { key: 'auditoria', label: 'Auditoría', icon: ClipboardList }] as const;

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-luxury-black transition-colors"><ArrowLeft size={14} /> Volver al inicio</Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">Gestión de clientes</p>
              <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">Tipos de Clientes</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">Registro, membresías y beneficios por nivel de cliente.</p>
            </div>
            <button onClick={verificarExpiraciones} className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-luxury-gold/30 bg-luxury-champagne/40 px-6 py-3 text-sm font-semibold text-luxury-charcoal hover:bg-luxury-champagne transition"><RefreshCw size={15} /> Verificar Expiraciones</button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[{ l: 'Total', v: clientes.length, c: 'text-luxury-black' }, { l: 'Estándar', v: clientes.filter(c => c.tipo_cliente === 'ESTANDAR').length, c: 'text-luxury-charcoal' }, { l: 'Premium', v: clientes.filter(c => c.tipo_cliente === 'PREMIUM').length, c: 'text-amber-600' }, { l: 'VIP', v: clientes.filter(c => c.tipo_cliente === 'VIP').length, c: 'text-purple-600' }].map(s => (
              <div key={s.l} className="rounded-2xl border border-luxury-gold/15 bg-luxury-champagne/30 px-5 py-4"><p className={`font-serif text-3xl font-bold ${s.c}`}>{s.v}</p><p className="mt-1 text-xs uppercase tracking-wider text-luxury-charcoal/60">{s.l}</p></div>
            ))}
          </div>
        </header>

        {mensaje && <div className={`rounded-2xl border px-6 py-4 text-sm font-medium ${mensaje.tipo === 'exito' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{mensaje.texto}</div>}

        <div className="flex flex-wrap gap-2 border-b border-luxury-gold/20 pb-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setVistaActiva(key)} className={`inline-flex items-center gap-2 rounded-t-xl px-5 py-2.5 text-sm font-medium transition ${vistaActiva === key ? 'bg-luxury-black text-luxury-gold' : 'text-luxury-charcoal/60 hover:bg-luxury-champagne/40'}`}><Icon size={14} /> {label}</button>
          ))}
        </div>

        {vistaActiva === 'lista' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-luxury-champagne/30 text-xs uppercase tracking-wider text-luxury-charcoal/60">
                <tr><th className="px-8 py-4 text-left">Cliente</th><th className="px-8 py-4 text-left">Contacto</th><th className="px-8 py-4 text-left">Tipo</th><th className="px-8 py-4 text-left">Membresía</th><th className="px-8 py-4 text-left">Vence</th></tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/10">
                {clientes.map(c => (
                  <tr key={c.id_cliente} className="hover:bg-luxury-champagne/20 transition">
                    <td className="px-8 py-4"><p className="font-medium text-luxury-black">{c.nombre_completo}</p><p className="text-xs text-luxury-charcoal/50">{c.numero_cliente}</p></td>
                    <td className="px-8 py-4 text-luxury-charcoal/70">{c.correo_electronico}</td>
                    <td className="px-8 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${badgeTipo(c.tipo_cliente)}`}>{iconTipo(c.tipo_cliente)} {c.tipo_cliente}</span></td>
                    <td className="px-8 py-4">{c.membresia ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeMem(c.membresia.estado)}`}>{c.membresia.estado}</span> : <span className="text-luxury-charcoal/30 text-xs">Sin membresía</span>}</td>
                    <td className="px-8 py-4 text-xs text-luxury-charcoal/60">{c.membresia?.fecha_fin ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {vistaActiva === 'registrar' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-black"><Users size={18} className="text-luxury-gold" /></div>
              <div><h2 className="font-serif text-xl">Registrar Cliente</h2><p className="text-xs text-luxury-charcoal/50">UC-09 · Tipo ESTÁNDAR por defecto</p></div>
            </div>
            <div className="p-8"><form onSubmit={handleSubmitRegistrar} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[{ l: 'Nombre Completo', n: 'nombre_completo', ph: 'Ana López' }, { l: 'Correo', n: 'correo_electronico', ph: 'cliente@email.com' }, { l: 'Teléfono', n: 'telefono', ph: '555-0000' }, { l: 'Documento', n: 'documento_identificacion', ph: 'DOC-123' }, { l: 'Dirección', n: 'direccion', ph: 'Calle, Ciudad' }].map(f => (
                  <div key={f.n} className={f.n === 'direccion' ? 'md:col-span-2' : ''}>
                    <label className="mb-2 block text-sm font-medium">{f.l}</label>
                    <input type="text" name={f.n} value={formRegistrar[f.n as keyof typeof formRegistrar]} onChange={handleChangeRegistrar} placeholder={f.ph} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm placeholder-luxury-charcoal/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3"><button type="submit" className="flex-1 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal">Registrar</button><button type="button" onClick={() => setVistaActiva('lista')} className="rounded-2xl border border-luxury-gold/30 px-6 py-3 text-sm text-luxury-charcoal hover:bg-luxury-champagne/40">Cancelar</button></div>
            </form></div>
          </div>
        )}

        {vistaActiva === 'membresia' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-black"><Crown size={18} className="text-luxury-gold" /></div>
              <div><h2 className="font-serif text-xl">Activar Membresía</h2><p className="text-xs text-luxury-charcoal/50">UC-10 · 3, 6 o 12 meses</p></div>
            </div>
            <div className="p-8"><form onSubmit={handleSubmitMembresia} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div><label className="mb-2 block text-sm font-medium">Cliente *</label><select name="id_cliente" value={formMembresia.id_cliente} onChange={handleChangeMembresia} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none"><option value="">Seleccione...</option>{clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_completo} — {c.tipo_cliente}</option>)}</select></div>
                <div><label className="mb-2 block text-sm font-medium">Tipo *</label><select name="tipo_membresia" value={formMembresia.tipo_membresia} onChange={handleChangeMembresia} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none"><option value="">Seleccione...</option><option value="PREMIUM">Premium</option><option value="VIP">VIP</option></select></div>
                <div><label className="mb-2 block text-sm font-medium">Plan *</label><select name="plan_meses" value={formMembresia.plan_meses} onChange={handleChangeMembresia} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none"><option value="">Seleccione...</option><option value="3">3 meses</option><option value="6">6 meses</option><option value="12">12 meses</option></select></div>
                <div><label className="mb-2 block text-sm font-medium">Pago *</label><select name="tipo_pago" value={formMembresia.tipo_pago} onChange={handleChangeMembresia} required className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none"><option value="">Seleccione...</option><option value="EFECTIVO">Efectivo</option><option value="TARJETA_CREDITO">Tarjeta de Crédito</option></select></div>
              </div>
              {costoPreview !== null && <div className="rounded-2xl border border-luxury-gold/30 bg-luxury-champagne/30 p-6"><p className="text-xs uppercase tracking-wider text-luxury-charcoal/60 mb-1">Costo</p><p className="font-serif text-4xl font-bold text-luxury-gold">${costoPreview.toLocaleString()}</p></div>}
              <div className="flex gap-3"><button type="submit" className="flex-1 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal">Activar</button><button type="button" onClick={() => setVistaActiva('lista')} className="rounded-2xl border border-luxury-gold/30 px-6 py-3 text-sm text-luxury-charcoal hover:bg-luxury-champagne/40">Cancelar</button></div>
            </form></div>
          </div>
        )}

        {vistaActiva === 'beneficios' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(['ESTANDAR', 'PREMIUM', 'VIP'] as TipoCliente[]).map(tipo => {
              const b = getBeneficiosPorTipo(tipo);
              return (
                <div key={tipo} className={`rounded-3xl border bg-white p-8 shadow-sm ${tipo === 'VIP' ? 'border-purple-200' : tipo === 'PREMIUM' ? 'border-amber-200' : 'border-luxury-gold/20'}`}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tipo === 'VIP' ? 'bg-purple-100 text-purple-700' : tipo === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-luxury-champagne text-luxury-charcoal'}`}>
                      {tipo === 'VIP' ? <Crown size={22} /> : tipo === 'PREMIUM' ? <Star size={22} /> : <Users size={22} />}
                    </div>
                    <p className="font-serif text-xl font-bold">{tipo}</p>
                  </div>
                  {b ? (
                    <div className="space-y-3">
                      {[{ l: 'Villas', v: b.acceso_villas ? '✓ Incluido' : '✗ No' }, { l: 'Amenidades', v: b.tipo_amenidades }, { l: 'Prioridad', v: b.prioridad_reserva }, { l: 'Cancelación', v: b.politica_cancelacion }].map(i => (
                        <div key={i.l} className="rounded-xl bg-luxury-champagne/20 p-4"><p className="text-xs uppercase tracking-wider text-luxury-charcoal/50 mb-1">{i.l}</p><p className="text-sm font-medium">{i.v}</p></div>
                      ))}
                      <div className="rounded-xl bg-luxury-champagne/20 p-4"><p className="text-xs uppercase tracking-wider text-luxury-charcoal/50 mb-2">Tarifas</p>
                        {([3, 6, 12] as const).map(m => <div key={m} className="flex justify-between text-sm mb-1"><span className="text-luxury-charcoal/70">{m} meses</span><span className="font-semibold">{(tarifas[tipo]?.[m] ?? 0) === 0 ? 'Gratis' : `$${(tarifas[tipo]?.[m] ?? 0).toLocaleString()}`}</span></div>)}
                      </div>
                    </div>
                  ) : <p className="text-sm text-luxury-charcoal/40">Sin datos</p>}
                </div>
              );
            })}
          </div>
        )}

        {vistaActiva === 'auditoria' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-luxury-champagne/30 text-xs uppercase tracking-wider text-luxury-charcoal/60">
                <tr><th className="px-8 py-4 text-left">Fecha</th><th className="px-8 py-4 text-left">Acción</th><th className="px-8 py-4 text-left">Descripción</th><th className="px-8 py-4 text-left">ID</th><th className="px-8 py-4 text-left">IP</th></tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/10">
                {auditoria.map(r => (
                  <tr key={r.id_registro} className="hover:bg-luxury-champagne/20">
                    <td className="px-8 py-4 text-luxury-charcoal/70 whitespace-nowrap">{r.fecha_hora}</td>
                    <td className="px-8 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.accion === 'REGISTRAR_CLIENTE' ? 'bg-blue-100 text-blue-700' : r.accion === 'ACTIVAR_MEMBRESIA' ? 'bg-green-100 text-green-700' : r.accion === 'EXPIRACION_MEMBRESIA' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{r.accion}</span></td>
                    <td className="px-8 py-4 text-luxury-charcoal/80">{r.descripcion}</td>
                    <td className="px-8 py-4 text-luxury-charcoal/50">{r.id_entidad}</td>
                    <td className="px-8 py-4 font-mono text-xs text-luxury-charcoal/50">{r.ip_origen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
