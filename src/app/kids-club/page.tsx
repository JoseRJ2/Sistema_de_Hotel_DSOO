'use client';

import { useKidsClub } from '../../hooks/useKidsClub';

export default function KidsClubPage() {
  const { formData, handleChange, handleSubmit } = useKidsClub();

  return (
    <main className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-t-8 border-sky-400">
        
        <div className="bg-sky-900 px-8 py-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-sky-100">
            Inscripción al Kids Club
          </h2>
          <p className="mt-2 text-sky-200 text-sm">
            Aventuras seguras y diversión garantizada para los más pequeños de la villa.
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Campo: Nombre del Niño */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo del Menor</label>
                <input
                  type="text"
                  name="nombreNino"
                  value={formData.nombreNino}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Mateo García"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-700"
                />
              </div>

              {/* Campo: Edad */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Edad (4 a 12 años)</label>
                <input
                  type="number"
                  name="edadNino"
                  min="4"
                  max="12"
                  value={formData.edadNino}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-700"
                />
              </div>

              {/* Campo: Fecha */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de la Actividad</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-700"
                />
              </div>

              {/* Campo: Actividad */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Actividad a Inscribir</label>
                <select
                  name="actividad"
                  value={formData.actividad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-700"
                >
                  <option value="">Seleccione una actividad...</option>
                  <option value="taller_arte">Taller de Arte y Pintura (10:00 - 12:00)</option>
                  <option value="juegos_piscina">Juegos Acuáticos Guiados (13:00 - 15:00)</option>
                  <option value="cine_infantil">Tarde de Cine y Palomitas (17:00 - 19:00)</option>
                </select>
              </div>

              {/* Campo: Alergias o Notas (Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias o Notas Médicas (Si no posee puede no escribir nada)</label>
                <textarea
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ninguna"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-700"
                ></textarea>
              </div>

            </div>

            {/* Restricción visible de negocio */}
            <div className="bg-sky-50 border-l-4 border-sky-400 p-4 mt-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-sky-800">
                    <strong>Regla de Negocio:</strong> Las actividades del Kids Club son exclusivas para clientes alojados en las Villas Premium o con membresía VIP.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition duration-300 shadow-md"
              >
                Inscribir Menor
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}