'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';

function getPostLoginRoute(payload: { es_empleado: boolean; id_cliente: number | null }): string {
  if (payload.id_cliente) return '/dashboard-cliente';
  return payload.es_empleado ? '/' : '/dashboard-cliente';
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const result = await login(correo, contrasena);

    setCargando(false);

    if (!result.ok || !result.usuario) {
      setError(result.error ?? 'Error al iniciar sesión');
      return;
    }

    const redirectRoute = getPostLoginRoute({
      es_empleado: result.usuario.es_empleado,
      id_cliente: result.usuario.id_cliente,
    });
    router.push(redirectRoute);
  };

  return (
    <main className="min-h-screen bg-luxury-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-black transition-colors mb-8">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
        <div className="rounded-3xl border border-luxury-gold/25 bg-white p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="font-serif text-2xl tracking-[0.2em] text-black font-light mb-2">EL REFUGIO</div>
            <div className="w-12 h-px bg-luxury-gold mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-black mb-2">Iniciar Sesión</h1>
            <p className="text-sm text-black/60">Accede a tu cuenta de empleado o cliente</p>
          </div>
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Correo Electrónico</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tucorreo@ejemplo.com" required
                className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Contraseña</label>
              <div className="relative">
                <input type={mostrarPass ? 'text' : 'password'} value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Tu contraseña" required
                  className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 pr-12 text-sm text-black placeholder-black/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
                <button type="button" onClick={() => setMostrarPass(!mostrarPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition">
                  {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={cargando}
              className="w-full rounded-2xl bg-luxury-black px-6 py-3.5 text-sm font-semibold text-luxury-gold shadow-sm transition hover:bg-luxury-charcoal disabled:opacity-50 flex items-center justify-center gap-2">
              {cargando ? <span className="animate-pulse">Verificando...</span> : <><LogIn size={16} /> Iniciar Sesión</>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-black/60">¿No tienes cuenta? <Link href="/registro" className="font-semibold text-luxury-gold hover:underline">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}
