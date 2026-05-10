'use client';

import { useReservaRestaurante } from "@/hooks/useReservaRestaurante";

export default function Home() {
  const { formData, handleChange, handleSubmit } = useReservaRestaurante();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Encabezado elegante */}
        <div className="bg-slate-900 px-8 py-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-amber-500">
            Reserva de Restaurante
          </h2>
          <p className="mt-2 text-slate-300 text-sm">
            Asegure su mesa y disfrute de una experiencia gastronómica inolvidable.
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Campo: Fecha */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de la Reserva</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                />
              </div>

              {/* Campo: Turno */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Horario de Reserva (Máx. 2 horas)
                </label>
                <select
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                >
                  <option value="">Seleccione un horario...</option>
                  
                  <optgroup label="Desayuno">
                    <option value="desayuno_temprano">07:00 - 09:00</option>
                    <option value="desayuno_tarde">09:30 - 11:30</option>
                  </optgroup>

                  <optgroup label="Comida">
                    <option value="comida_temprano">13:00 - 15:00</option>
                    <option value="comida_tarde">15:30 - 17:30</option>
                  </optgroup>

                  <optgroup label="Cena">
                    <option value="cena_temprano">19:00 - 21:00</option>
                    <option value="cena_tarde">21:30 - 23:30</option>
                  </optgroup>
                  
                </select>
              </div>

              {/* Campo: Cantidad de Personas */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Personas</label>
                <input
                  type="number"
                  name="personas"
                  min="1"
                  max="6"
                  value={formData.personas}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                />
              </div>

              {/* Campo: Tipo de Servicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                <select
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700 bg-white"
                >
                  <option value="">Seleccione el servicio</option>
                  <option value="carta">A la Carta</option>
                  <option value="buffet">Menú Degustación / Buffet</option>
                </select>
              </div>
            </div>

            {/* Mensaje de validación visual simulado */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <strong>Nota:</strong> La disponibilidad y asignación de mesas preferenciales están sujetas a su nivel de membresía (Estándar, Premium o VIP).
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-slate-900 text-amber-500 font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition duration-300 shadow-md"
              >
                Verificar Disponibilidad y Reservar
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}