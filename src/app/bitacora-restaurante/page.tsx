'use client';

import { useBitacoraRestaurante } from '../../hooks/useBitacoraRestaurante';

export default function BitacoraRestaurantePage() {
  const { turnoSeleccionado, setTurnoSeleccionado, reservasFiltradas, asignarMesa, cancelarReserva, finalizarReserva } = useBitacoraRestaurante();

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-amber-500">Bitácora de Restaurante (Host)</h2>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            {['Desayuno', 'Comida', 'Cena'].map((turno) => (
              <button
                key={turno}
                onClick={() => setTurnoSeleccionado(turno as any)}
                className={`px-4 py-2 rounded-md font-bold ${turnoSeleccionado === turno ? 'bg-amber-500 text-slate-900' : 'bg-slate-200 text-slate-600'}`}
              >
                {turno}
              </button>
            ))}
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-slate-600 uppercase text-sm">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Cliente</th>
                <th className="p-3 border-b">Horario</th>
                <th className="p-3 border-b">Personas</th>
                <th className="p-3 border-b">Estado</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((res) => (
                  <tr key={res.id_reserva} className="hover:bg-slate-50 border-b">
                    <td className="p-3 font-bold text-slate-700">#{res.id_reserva}</td>
                    <td className="p-3">
                      {res.cliente} <span className={`text-xs px-2 py-1 rounded ml-2 ${res.membresia === 'VIP' ? 'bg-purple-200 text-purple-800' : res.membresia === 'PREMIUM' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{res.membresia}</span>
                    </td>
                    <td className="p-3 text-slate-600">{res.turno_hora}</td>
                    <td className="p-3 text-slate-600">{res.personas} pax</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : res.estado === 'EN_USO' ? 'bg-green-100 text-green-800' : res.estado === 'FINALIZADA' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {res.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {/* Lógica dictada por el Diagrama de Estados */}
                      {res.estado === 'PENDIENTE' && (
                        <>
                          <button onClick={() => asignarMesa(res.id_reserva)} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700">Dar Mesa</button>
                          <button onClick={() => cancelarReserva(res.id_reserva)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-600">Cancelar</button>
                        </>
                      )}
                      {res.estado === 'EN_USO' && (
                        <button onClick={() => finalizarReserva(res.id_reserva)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-600">Finalizar (Check-out)</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No hay reservas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}