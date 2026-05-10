'use client';
import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from 'react';

export type TipoCliente = 'ESTANDAR' | 'PREMIUM' | 'VIP';
const TARIFAS: Record<string, Record<number, number>> = {
  PREMIUM: { 3: 1500, 6: 2800, 12: 5000 },
  VIP: { 3: 3000, 6: 5500, 12: 9500 },
  ESTANDAR: { 3: 0, 6: 0, 12: 0 },
};

export const useTiposClientes = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [auditoria, setAuditoria] = useState<any[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'registrar' | 'membresia' | 'beneficios' | 'auditoria'>('lista');
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [formRegistrar, setFormRegistrar] = useState({ nombre_completo: '', correo_electronico: '', telefono: '', documento_identificacion: '', direccion: '' });
  const [formMembresia, setFormMembresia] = useState({ id_cliente: '', tipo_membresia: '', plan_meses: '', tipo_pago: '' });

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 3500); };

  const cargarDatos = async () => {
    try {
      const [c, b, a] = await Promise.all([
        fetch('/api/clientes').then(r => r.json()),
        fetch('/api/beneficios').then(r => r.json()),
        fetch('/api/auditoria').then(r => r.json()),
      ]);
      if (Array.isArray(c)) setClientes(c.map((cl: any) => ({
        id_cliente: cl.id_cliente, numero_cliente: cl.numero_cliente,
        nombre_completo: cl.Usuario?.nombre_completo ?? '',
        correo_electronico: cl.Usuario?.correo_electronico ?? '',
        telefono: cl.telefono ?? '',
        tipo_cliente: (cl.Usuario?.Rol?.nombre?.toUpperCase().includes('VIP') ? 'VIP' : cl.Usuario?.Rol?.nombre?.toUpperCase().includes('PREMIUM') ? 'PREMIUM' : 'ESTANDAR') as TipoCliente,
        fecha_registro: cl.fecha_registro?.slice(0, 10) ?? '',
        membresia: cl.Membresia?.[0] ? { estado: cl.Membresia[0].estado, fecha_fin: cl.Membresia[0].fecha_fin?.slice(0, 10) ?? '' } : null,
      })));
      if (Array.isArray(b)) setBeneficios(b);
      if (Array.isArray(a)) setAuditoria(a.filter((r: any) => ['REGISTRAR_CLIENTE', 'ACTIVAR_MEMBRESIA', 'EXTENDER_MEMBRESIA', 'EXPIRACION_MEMBRESIA'].includes(r.accion)));
    } catch { /* silent */ }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleChangeRegistrar = (e: ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setFormRegistrar(prev => ({ ...prev, [name]: value })); };

  const handleSubmitRegistrar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formRegistrar) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Cliente registrado como ESTÁNDAR.');
      setFormRegistrar({ nombre_completo: '', correo_electronico: '', telefono: '', documento_identificacion: '', direccion: '' });
      setVistaActiva('lista');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const handleChangeMembresia = (e: ChangeEvent<HTMLSelectElement>) => { const { name, value } = e.target; setFormMembresia(prev => ({ ...prev, [name]: value })); };

  const handleSubmitMembresia = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/membresias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formMembresia) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Membresía activada correctamente.');
      setFormMembresia({ id_cliente: '', tipo_membresia: '', plan_meses: '', tipo_pago: '' });
      setVistaActiva('lista');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const verificarExpiraciones = async () => {
    try {
      const res = await fetch('/api/membresias/verificar-expiraciones', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', 'Error al verificar'); return; }
      mostrarMensaje('exito', `✓ ${data.vencidas} membresías vencidas procesadas.`);
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const getBeneficiosPorTipo = (tipo: TipoCliente) => beneficios.find((b: any) => b.Rol?.nombre?.toUpperCase().includes(tipo)) ?? null;

  const clienteMembresia = clientes.find(c => c.id_cliente === Number(formMembresia.id_cliente)) ?? null;
  const costoPreview = useMemo(() => {
    if (!formMembresia.tipo_membresia || !formMembresia.plan_meses) return null;
    return TARIFAS[formMembresia.tipo_membresia]?.[Number(formMembresia.plan_meses)] ?? null;
  }, [formMembresia.tipo_membresia, formMembresia.plan_meses]);

  return { clientes, beneficios, auditoria, tarifas: TARIFAS, vistaActiva, setVistaActiva, mensaje, formRegistrar, formMembresia, costoPreview, clienteMembresia, handleChangeRegistrar, handleSubmitRegistrar, handleChangeMembresia, handleSubmitMembresia, verificarExpiraciones, getBeneficiosPorTipo };
};
