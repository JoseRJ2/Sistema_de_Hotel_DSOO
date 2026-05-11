'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre_completo: '', correo_electronico: '', contrasena: '', telefono: '', documento_identificacion: '', direccion: '' });
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await fetch('/api/auth/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setCargando(false); return; }
      window.location.href = '/';
    } catch { setError('Error de conexión'); setCargando(false); }
  };

  return (
    <main className="min-h-screen bg-luxury-ivory flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-black transition-colors mb-8">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
        <div className="rounded-3xl border border-luxury-gold/25 bg-white p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="font-serif text-2xl tracking-[0.2em] text-black font-light mb-2">EL REFUGIO</div>
            <div className="w-12 h-px bg-luxury-gold mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-black mb-2">Crear Cuenta</h1>
            <p className="text-sm text-black/60">Regístrate como cliente para acceder a reservas y membresías</p>
          </div>
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Nombre Completo *</label>
              <input type="text" name="nombre_completo" value={form.nombre_completo} onChange={handleChange} placeholder="Ej. María García" required
                className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Correo Electrónico *</label>
              <input type="email" name="correo_electronico" value={form.correo_electronico} onChange={handleChange} placeholder="tucorreo@gmail.com" required
                className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Contraseña *</label>
              <div className="relative">
                <input type={mostrarPass ? 'text' : 'password'} name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="Mínimo 6 caracteres" required
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 pr-12 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
                <button type="button" onClick={() => setMostrarPass(!mostrarPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"><EyeOff size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1.5 block text-sm font-medium text-black">Teléfono</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} placeholder="555-0000" className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-black">Documento ID</label>
                <input type="text" name="documento_identificacion" value={form.documento_identificacion} onChange={handleChange} placeholder="INE/Pasaporte" className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" /></div>
            </div>
            <div><label className="mb-1.5 block text-sm font-medium text-black">Dirección</label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, Ciudad" className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" /></div>
            <button type="submit" disabled={cargando}
              className="w-full rounded-2xl bg-luxury-black px-6 py-3.5 text-sm font-semibold text-luxury-gold shadow-sm transition hover:bg-luxury-charcoal disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
              {cargando ? <span className="animate-pulse">Registrando...</span> : <><UserPlus size={16} /> Crear mi cuenta</>}
            </button>
          </form>
          <div className="mt-6 text-center"><p className="text-sm text-black/60">¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-luxury-gold hover:underline">Iniciar Sesión</Link></p></div>
          <div className="mt-6 rounded-2xl border border-luxury-gold/15 bg-luxury-champagne/20 p-4">
            <p className="text-xs text-black/60 text-center">Al registrarte inicias como cliente <strong>Estándar</strong>. Puedes actualizar a Premium o VIP desde tu perfil.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
