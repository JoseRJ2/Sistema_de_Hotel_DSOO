'use client';

import Link from 'next/link';
import { useBitacoraRestaurante } from '../../hooks/useBitacoraRestaurante';

export default function BitacoraRestaurantePage() {
  const { 
    turnoSeleccionado, 
    setTurnoSeleccionado, 
    reservasFiltradas, 
    cambiarEstado, 
    cancelarReserva 
  } = useBitacoraRestaurante();

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-500">Bitácora de Recepción</h2>
            <p className="text-slate-300 text-sm mt-1">Gestión de Mesas del Restaurante</p>
          </div>
          
          <div className="flex gap-3">
            <span className="bg-amber-500 text-slate-900 text-sm font-bold px-3 py-2 rounded flex items-center">
              Usuario: Host
            </span>
            <Link 
              href="/restaurante" 
              className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-emerald-500 transition shadow-md flex items-center"
              title="Registrar a un cliente que llegó sin reservación (Walk-in)"
            >
              + Walk-in (Nueva Reserva)
            </Link>
          </div>
        </div>

        <div className="p-6">
          
          {/* FILTRO DE TURNOS (Flujo Normal) */}
          <div className="flex gap-2 mb-6 border-b-2 border-slate-200 pb-4">
            {(['Desayuno', 'Comida', 'Cena'] as const).map((turno) => (
              <button
                key={turno}
                onClick={() => setTurnoSeleccionado(turno)}
                className={`px-6 py-2 rounded-t-lg font-bold transition-all ${
                  turnoSeleccionado === turno 
                    ? 'bg-amber-500 text-slate-900 shadow-sm border-b-4 border-slate-900' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Turno {turno}
              </button>
            ))}
          </div>

          {/* TABLA DE RESERVAS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b-2 border-slate-200">
                  <th className="p-3">ID Reserva</th>
                  <th className="p-3">Cliente (Nivel)</th>
                  <th className="p-3">Horario</th>
                  <th className="p-3 text-center">Personas</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.length > 0 ? (
                  reservasFiltradas.map((res) => (
                    <tr key={res.id_reserva} className="border-b hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-500">#{res.id_reserva}</td>
                      <td className="p-3 font-medium text-slate-700">{res.cliente} <span className="text-xs text-amber-600 font-bold">({res.membresia})</span></td>
                      <td className="p-3 text-slate-600 font-mono text-sm">{res.turno_hora}</td>
                      <td className="p-3 text-center font-bold text-slate-700">{res.personas}</td>
                      
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          res.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          res.estado === 'En Uso' ? 'bg-emerald-100 text-emerald-700' :
                          res.estado === 'Cancelada' ? 'bg-red-100 text-red-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {res.estado}
                        </span>
                      </td>

                      <td className="p-3 flex justify-center gap-2">
                        {/* Estado: Pendiente */}
                        {res.estado === 'Pendiente' && (
                          <>
                            <button 
                              onClick={() => cambiarEstado(res.id_reserva, 'En Uso')} 
                              className="bg-slate-800 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 font-bold"
                            >
                              Dar Mesa
                            </button>
                            <button 
                              onClick={() => cancelarReserva(res.id_reserva)} 
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 font-bold"
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {/* Estado: En Uso  */}
                        {res.estado === 'En Uso' && (
                          <button 
                            onClick={() => cambiarEstado(res.id_reserva, 'Finalizada')} 
                            className="bg-amber-500 text-slate-900 px-3 py-1 rounded text-sm hover:bg-amber-400 font-bold"
                          >
                            Liberar Mesa
                          </button>
                        )}

                        {/* Estados inactivos */}
                        {(res.estado === 'Finalizada' || res.estado === 'Cancelada') && (
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider py-1">Cerrada</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No hay reservaciones para el turno de {turnoSeleccionado}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>
  );
}