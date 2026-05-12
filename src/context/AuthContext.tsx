'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface SessionUser {
  id_usuario: number;
  nombre_completo: string;
  correo_electronico: string;
  id_rol: number;
  rol_nombre: string;
  es_empleado: boolean;
  id_cliente: number | null;
  tipo_cliente: 'ESTANDAR' | 'PREMIUM' | 'VIP' | null;
}

interface LoginResult {
  ok: boolean;
  usuario?: SessionUser;
  error?: string;
}

interface AuthContextType {
  usuario: SessionUser | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  esEmpleado: boolean;
  esCliente: boolean;
  puedeVerVillas: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<SessionUser | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarSesion = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setUsuario(data.usuario ?? null);
    } catch { setUsuario(null); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarSesion();
  }, [cargarSesion]);

  const login = async (correo: string, contrasena: string): Promise<LoginResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo_electronico: correo, contrasena }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };

      const loggedUser = data.usuario as SessionUser;
      setUsuario(loggedUser);
      return { ok: true, usuario: loggedUser };
    } catch { return { ok: false, error: 'Error de conexión' }; }
  };

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setUsuario(null);
  };

  const esEmpleado = usuario?.es_empleado ?? false;
  const esCliente = !!usuario && !usuario.es_empleado;
  const puedeVerVillas = esEmpleado || usuario?.tipo_cliente === 'PREMIUM' || usuario?.tipo_cliente === 'VIP';

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, esEmpleado, esCliente, puedeVerVillas }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
