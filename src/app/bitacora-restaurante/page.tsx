'use client';

import { useState, useEffect, useRef } from 'react';
import { useBitacoraRestaurante } from '@/hooks/useBitacoraRestaurante';
import { useAuth } from '@/context/AuthContext';
import { Search, Utensils, UserPlus, CheckCircle, XCircle, LogIn, Star, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BitacoraRestaurantePage() {
  const { esEmpleado } = useAuth(); // Actor: pepe (Empleado)
  const { registros: registrosServidor, cargando, consultarBitacora, cambiarEstadoReserva } = useBitacoraRestaurante();
  
  // Nomenclatura del diagrama: "lista" de registros
  const [lista, setLista] = useState<any[]>([]); 
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [filtroTurno, setFiltroTurno] = useState('TODOS');
  const [busquedaNombre, setBusquedaNombre] = useState('');

  // Semáforo para control de flujo de datos
  const bloqueadoPorAccion = useRef(false);

  /**
   * Mensaje: solicitarRangoFechas(fechaInicio, fechaFin)
   */
  const solicitarRangoFechas = (fecha: string) => {
    bloqueadoPorAccion.current = false;
    setFechaSeleccionada(fecha);
    consultarBitacora(fecha, fecha);
  };

  useEffect(() => {
    solicitarRangoFechas(fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (registrosServidor && !bloqueadoPorAccion.current) {
      setLista(registrosServidor);
    }
  }, [registrosServidor]);

  /**
   * Mensaje: procesarTransicionEstado(id, nuevoEstado)
   * Implementa actualización optimista y persistencia
   */
  const procesarTransicionEstado = async (id: number, nuevoEstado: string) => {
    bloqueadoPorAccion.current = true;

    // Actualización de UI inmediata (Optimista)
    if (nuevoEstado === 'FINALIZADA' || nuevoEstado === 'CANCELADA') {
      setLista(prev => prev.filter(r => Number(r.id_servicio) !== Number(id)));
    } else {
      setLista(prev => prev.map(r => 
        Number(r.id_servicio) === Number(id) ? { ...r, estado: nuevoEstado } : r
      ));
    }

    try {
      await cambiarEstadoReserva(id, nuevoEstado);
      setTimeout(() => { bloqueadoPorAccion.current = false; }, 1000);
    } catch (error) {
      alert("Error al guardar en BD");
      bloqueadoPorAccion.current = false;
      solicitarRangoFechas(fechaSeleccionada);
    }
  };

  if (!esEmpleado) return <div className="p-10 text-center text-red-500 font-bold">Acceso Denegado.</div>;

  const registrosFiltrados = lista.filter(reg => {
    const cumpleTurno = filtroTurno === 'TODOS' || reg.turno === filtroTurno;
    const cumpleNombre = (reg.nombre_huesped || "").toLowerCase().includes(busquedaNombre.toLowerCase());
    return cumpleTurno && cumpleNombre;
  });

  return (
    <main className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Bitácora de Restaurante</h1>
            <p className="text-slate-500">Gestión de estados según flujo de auditoría.</p>
          </div>
          <Link href="/restaurante" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <UserPlus size={20} /> Nueva Reserva
          </Link>
        </div>

        {/* Filtros e invocación de solicitarRangoFechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fecha de Consulta</label>
            <input type="date" value={fechaSeleccionada} onChange={(e) => solicitarRangoFechas(e.target.value)} className="w-full outline-none text-slate-700 bg-transparent font-medium" />
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Filtrar por Turno</label>
            <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)} className="w-full outline-none text-slate-700 bg-transparent font-medium">
              <option value="TODOS">Todos los Turnos</option>
              <option value="DESAYUNO">Desayunos</option>
              <option value="COMIDA">Comidas</option>
              <option value="CENA">Cenas</option>
            </select>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Search className="text-slate-400" size={18} />
            <input type="text" placeholder="Buscar por nombre..." value={busquedaNombre} onChange={(e) => setBusquedaNombre(e.target.value)} className="w-full outline-none text-slate-700 bg-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          {cargando && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          )}
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reserva</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Cliente / Nivel</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Horario</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase">Pax</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Estado Actual</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.map((res) => (
                <tr key={res.id_servicio} className={`transition-all duration-200 hover:bg-slate-50/80 ${res.tipo_cliente !== 'ESTANDAR' ? 'bg-amber-50/20' : ''}`}>
                  <td className="p-4 text-sm font-mono text-slate-400">#{res.id_servicio}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{res.nombre_huesped}</span>
                      {res.tipo_cliente !== 'ESTANDAR' && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> {res.tipo_cliente}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium capitalize">
                    {(res.hora_bloque || '').replace('_', ' ')}
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">{res.cantidad_personas}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      res.estado === 'PENDIENTE' ? 'bg-blue-100 text-blue-700' :
                      res.estado === 'EN_USO' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {res.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {res.estado === 'PENDIENTE' && (
                        <button 
                          onClick={() => procesarTransicionEstado(res.id_servicio, 'EN_USO')} 
                          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
                        >
                          <LogIn size={14} /> Dar Mesa
                        </button>
                      )}
                      {res.estado === 'EN_USO' && (
                        <button 
                          onClick={() => procesarTransicionEstado(res.id_servicio, 'FINALIZADA')} 
                          className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm active:scale-95 transition-all"
                        >
                          <CheckCircle size={14} /> Finalizar
                        </button>
                      )}
                      <button 
                        onClick={() => procesarTransicionEstado(res.id_servicio, 'CANCELADA')} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancelar Reserva"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {registrosFiltrados.length === 0 && !cargando && (
            <div className="p-20 text-center text-slate-400">
              <AlertCircle className="mx-auto mb-4 opacity-10" size={64} />
              <p className="font-medium">No hay registros para mostrar en este reporte.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}