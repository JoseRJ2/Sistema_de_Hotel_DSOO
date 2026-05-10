'use client';

import Link from 'next/link';
import { useAsistenciaKidsClub } from '../../hooks/useAsistenciaKidsClub';

export default function AsistenciaKidsClubPage() {
  const { 
    agendaDia, 
    actividadSeleccionada, 
    setActividadSeleccionada, 
    ninosFiltrados, 
    recibirNino, 
    registrarSalida,
    liberarCupo
  } = useAsistenciaKidsClub();

  return (
    <main className="min-h-screen bg-sky-50 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-t-8 border-sky-500">
        
        {/* ENCABEZADO Y BOTÓN DE EXCEPCIÓN */}
        <div className="bg-sky-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-sky-100">Kids Club Staff</h2>
            <p className="text-sky-300 text-sm mt-1">Control de Asistencia y Accesos</p>
          </div>
          
          <div className="flex gap-3">
            <span className="bg-sky-500 text-white text-sm font-bold px-3 py-2 rounded flex items-center">
              Usuario: Animador
            </span>
            {/* Botón para registro manual */}
            <Link 
              href="/kids-club" 
              className="bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded hover:bg-amber-400 transition shadow-md flex items-center"
              title="Registrar manualmente a un niño que llegó sin inscripción previa"
            >
              + Inscripción Rápida (Excepción)
            </Link>
          </div>
        </div>

        <div className="p-6">
          
          {/* Agenda del día */}
          <h3 className="text-lg font-bold text-slate-700 mb-4">Agenda del Día (Seleccione una actividad)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {agendaDia.map((actividad) => (
              <button
                key={actividad.id}
                onClick={() => setActividadSeleccionada(actividad)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  actividadSeleccionada?.id === actividad.id 
                    ? 'border-sky-500 bg-sky-50 shadow-md' 
                    : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sky-900">{actividad.nombre}</div>
                <div className="text-sm text-slate-500 mt-1">{actividad.horario}</div>
              </button>
            ))}
          </div>

          {/* Tabla de Niños */}
          {actividadSeleccionada ? (
            <div className="animate-fade-in">
              <div className="bg-sky-100 border-l-4 border-sky-500 p-3 mb-4 rounded flex justify-between items-center">
                <span className="font-semibold text-sky-800">
                  Mostrando inscritos para: {actividadSeleccionada.nombre} ({actividadSeleccionada.horario})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sky-50 text-sky-800 border-b-2 border-sky-200">
                      <th className="p-3">Nombre</th>
                      <th className="p-3 text-center">Edad</th>
                      <th className="p-3">Hab. Padres</th>
                      <th className="p-3 text-center">Entrada</th>
                      <th className="p-3 text-center">Salida</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ninosFiltrados.length > 0 ? (
                      ninosFiltrados.map((nino) => (
                        <tr key={nino.id_inscripcion} className="border-b hover:bg-sky-50 transition">
                          <td className="p-3 font-bold text-slate-700">{nino.nombreNino}</td>
                          <td className="p-3 text-center text-slate-600">{nino.edad} años</td>
                          <td className="p-3 text-slate-600 font-mono text-sm">{nino.habitacion_padres}</td>
                          <td className="p-3 text-center font-mono text-emerald-600">{nino.hora_entrada || '--:--'}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{nino.hora_salida || '--:--'}</td>
                          
                          <td className="p-3 flex justify-center gap-2">
                            {nino.estado === 'Registrada' && (
                              <>
                                <button 
                                  onClick={() => recibirNino(nino.id_inscripcion)} 
                                  className="bg-emerald-500 text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 font-bold shadow-sm"
                                >
                                  Recibir Niño
                                </button>
                                <button 
                                  onClick={() => liberarCupo(nino.id_inscripcion)} 
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 font-bold shadow-sm"
                                >
                                  Liberar Cupo
                                </button>
                              </>
                            )}
                            
                            {nino.estado === 'En Curso' && (
                              <button 
                                onClick={() => registrarSalida(nino.id_inscripcion)} 
                                className="bg-sky-600 text-white px-3 py-1 rounded text-sm hover:bg-sky-700 font-bold shadow-sm"
                              >
                                Registrar Salida
                              </button>
                            )}

                            {nino.estado === 'Finalizada' && (
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider py-1">Entregado</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No hay niños inscritos en esta actividad.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center p-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
              Seleccione una actividad de la agenda para ver la lista de niños.
            </div>
          )}

        </div>
      </div>
    </main>
  );
}