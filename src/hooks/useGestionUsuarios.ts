'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

export interface Rol { id_rol: number; nombre: string; descripcion: string; }
export interface Usuario { id_usuario: number; nombre_completo: string; correo_electronico: string; contrasena_hash: string; activo: boolean; id_rol: number; }
export interface RegistroAuditoria { id_registro: number; fecha_hora: string; accion: string; entidad_afectada: string; id_entidad: number; descripcion: string; ip_origen: string; }
export interface CrearUsuarioForm { nombre_completo: string; correo_electronico: string; contrasena_hash: string; id_rol: number | ''; }

export const useGestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'crear' | 'auditoria'>('lista');
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [formCrear, setFormCrear] = useState<CrearUsuarioForm>({ nombre_completo: '', correo_electronico: '', contrasena_hash: '', id_rol: '' });

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 3500); };

  const cargarDatos = async () => {
    try {
      const [u, r, a] = await Promise.all([
        fetch('/api/usuarios').then(r => r.json()),
        fetch('/api/roles').then(r => r.json()),
        fetch('/api/auditoria').then(r => r.json()),
      ]);
      if (Array.isArray(u)) setUsuarios(u);
      if (Array.isArray(r)) setRoles(r);
      if (Array.isArray(a)) setAuditoria(a);
    } catch { /* silent */ }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleChangeCrear = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormCrear(prev => ({ ...prev, [name]: name === 'id_rol' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmitCrear = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formCrear) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', `✓ Usuario "${data.nombre_completo}" creado exitosamente.`);
      setFormCrear({ nombre_completo: '', correo_electronico: '', contrasena_hash: '', id_rol: '' });
      setVistaActiva('lista');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const modificarRol = async (id_usuario: number, id_rol: number) => {
    try {
      const res = await fetch(`/api/usuarios/${id_usuario}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'MODIFICAR_ROL', id_rol }) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Rol actualizado correctamente.');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const desactivarUsuario = async (id_usuario: number) => {
    try {
      const res = await fetch(`/api/usuarios/${id_usuario}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'DESACTIVAR' }) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Usuario desactivado correctamente.');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const eliminarUsuario = async (id_usuario: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/usuarios/${id_usuario}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'ELIMINAR' }) });
      const data = await res.json();
      if (!res.ok) { mostrarMensaje('error', data.error); return; }
      mostrarMensaje('exito', '✓ Usuario eliminado permanentemente.');
      await cargarDatos();
    } catch { mostrarMensaje('error', 'Error de conexión'); }
  };

  const getNombreRol = (id_rol: number) => roles.find(r => r.id_rol === id_rol)?.nombre ?? '—';

  return { usuarios, roles, auditoria, vistaActiva, setVistaActiva, mensaje, formCrear, handleChangeCrear, handleSubmitCrear, modificarRol, desactivarUsuario, eliminarUsuario, getNombreRol };
};
