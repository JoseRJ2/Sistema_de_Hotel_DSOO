'use client';

import { useReservaRestaurante } from "@/hooks/useReservaRestaurante";

export default function ReservarRestaurantePage() {
  const { formData, handleChange, handleSubmit, mensaje, clienteActual } = useReservaRestaurante();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-amber-500">Reservar en Restaurante</h2>
          <p className="mt-2 text-slate-300 text-sm">Nivel de Membresía: <strong>{clienteActual.membresia}</strong></p>
        </div>

        <div className="p-8">
          {mensaje.texto && (
            <div className={`p-4 mb-6 rounded-md ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' : 'bg-green-50 text-green-700 border-l-4 border-green-500'}`}>
              {mensaje.texto}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md bg-slate-100 text-slate-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horario (Máx. 2 horas)</label>
                <select name="turno_hora" value={formData.turno_hora} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md bg-slate-100 text-slate-800">
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personas</label>
                <input type="number" name="personas" min="1" max="10" value={formData.personas} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md bg-slate-100 text-slate-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                <select name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md bg-slate-100 text-slate-800">
                  <option value="">Seleccione servicio</option>
                  <option value="A_LA_CARTA">A la Carta</option>
                  <option value="BUFFET">Buffet</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-slate-900 text-amber-500 font-bold py-3 rounded-md hover:bg-slate-800">
                Verificar Disponibilidad y Reservar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}