'use client';

import { useReservaRestaurante } from "@/hooks/useReservaRestaurante";

export default function ReservarRestaurantePage() {
  // Extraemos exactamente los nombres que devuelve nuestro Gestor (Hook)
  const { formData, handleChange, capturarDatosReserva, mensaje, clienteActual } = useReservaRestaurante();

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 font-sans text-slate-200">
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
        
        <div className="bg-slate-950 px-8 py-8 text-center border-b border-slate-800">
          <h2 className="text-3xl font-serif font-bold text-amber-500 tracking-wide">Reservar en Restaurante</h2>
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Membresía: <span className="text-amber-400 font-bold">{clienteActual.membresia}</span>
            </p>
          </div>
        </div>

        <div className="p-8">
          {mensaje.texto && (
            <div className={`p-4 mb-6 rounded-lg border ${
              mensaje.tipo === 'error' 
                ? 'bg-red-900/20 border-red-500/50 text-red-200' 
                : 'bg-green-900/20 border-green-500/50 text-green-200'
            }`}>
              {mensaje.texto}
            </div>
          )}

          {/* Formulario conectado al método capturarDatosReserva() del diagrama */}
          <form className="space-y-6" onSubmit={capturarDatosReserva}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Fecha</label>
                <input 
                  type="date" 
                  name="fecha" 
                  value={formData.fecha} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Horario de Reserva</label>
                <select 
                  name="turno" 
                  value={formData.turno} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white appearance-none transition-all"
                >
                  <option value="" className="bg-slate-800">Seleccione un horario...</option>
                  <optgroup label="Desayuno" className="bg-slate-900 text-amber-500">
                    <option value="desayuno_temprano">07:00 - 09:00</option>
                    <option value="desayuno_tarde">09:30 - 11:30</option>
                  </optgroup>
                  <optgroup label="Comida" className="bg-slate-900 text-amber-500">
                    <option value="comida_temprano">13:00 - 15:00</option>
                    <option value="comida_tarde">15:30 - 17:30</option>
                  </optgroup>
                  <optgroup label="Cena" className="bg-slate-900 text-amber-500">
                    <option value="cena_temprano">19:00 - 21:00</option>
                    <option value="cena_tarde">21:30 - 23:30</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Número de Personas</label>
                <input 
                  type="number" 
                  name="personas" 
                  min="1" 
                  max="10" 
                  value={formData.personas} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Servicio</label>
                <select 
                  name="tipo_servicio" 
                  value={formData.tipo_servicio} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all"
                >
                  <option value="" className="bg-slate-800">Seleccione servicio</option>
                  <option value="A_LA_CARTA">A la Carta</option>
                  <option value="BUFFET">Buffet</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20"
              >
                CONFIRMAR RESERVACIÓN
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}