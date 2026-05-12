'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useReservaRestaurante } from "@/hooks/useReservaRestaurante";

export default function ReservarRestaurantePage() {
  const { formData, handleChange, capturarDatosReserva, mensaje, clienteActual, turnosDisponibles } = useReservaRestaurante();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        <div className="bg-white px-8 py-8 text-center border-b border-gray-100">
          <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-wide">Reservar en Restaurante</h2>
          <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              Cliente: <span className="text-gray-900 font-semibold mr-2">{clienteActual.nombre}</span>
              Membresía: <span className="text-amber-600 font-bold">{clienteActual.membresia}</span>
            </p>
          </div>
        </div>

        <div className="p-8">
          {mensaje.texto && (
            <div className={`p-4 mb-6 rounded-lg border ${
              mensaje.tipo === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {mensaje.texto}
            </div>
          )}

          <form className="space-y-6" onSubmit={capturarDatosReserva}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input 
                  type="date" 
                  name="fecha" 
                  value={formData.fecha} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horario de Reserva</label>
                <select 
                  name="turno" 
                  value={formData.turno} 
                  onChange={handleChange} 
                  required 
                  disabled={!formData.fecha}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 appearance-none transition-all disabled:opacity-50"
                >
                  <option value="">
                    {!formData.fecha ? "Primero elija una fecha..." : turnosDisponibles.length > 0 ? "Seleccione un horario..." : "No hay turnos disponibles"}
                  </option>
                  
                  {turnosDisponibles.some(t => t.startsWith('desayuno')) && (
                    <optgroup label="Desayuno">
                      {turnosDisponibles.includes('desayuno_temprano') && <option value="desayuno_temprano">07:00 - 09:00</option>}
                      {turnosDisponibles.includes('desayuno_tarde') && <option value="desayuno_tarde">09:30 - 11:30</option>}
                    </optgroup>
                  )}

                  {turnosDisponibles.some(t => t.startsWith('comida')) && (
                    <optgroup label="Comida">
                      {turnosDisponibles.includes('comida_temprano') && <option value="comida_temprano">13:00 - 15:00</option>}
                      {turnosDisponibles.includes('comida_tarde') && <option value="comida_tarde">15:30 - 17:30</option>}
                    </optgroup>
                  )}

                  {turnosDisponibles.some(t => t.startsWith('cena')) && (
                    <optgroup label="Cena">
                      {turnosDisponibles.includes('cena_temprano') && <option value="cena_temprano">19:00 - 21:00</option>}
                      {turnosDisponibles.includes('cena_tarde') && <option value="cena_tarde">21:30 - 23:30</option>}
                    </optgroup>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Personas</label>
                <input 
                  type="number" 
                  name="personas" 
                  min="1" 
                  max="10" 
                  value={formData.personas} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio</label>
                <select 
                  name="tipo_servicio" 
                  value={formData.tipo_servicio} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 transition-all"
                >
                  <option value="">Seleccione servicio</option>
                  <option value="A_LA_CARTA">A la Carta</option>
                  <option value="BUFFET">Buffet</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* Botón de Confirmar (el que ya tienes) */}
              <button
                type="submit"
                className="flex-1 bg-luxury-gold text-white py-3 rounded-xl font-semibold hover:bg-luxury-gold/90 transition-all shadow-lg"
              >
                Confirmar Reserva
              </button>

              {/* BOTÓN DE CANCELAR (Flujo S1) */}
              <Link
                href="/dashboard-cliente"
                className="flex-1 flex items-center justify-center gap-2 border border-luxury-charcoal/20 text-luxury-charcoal/60 py-3 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <X size={18} />
                Cancelar Operación
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}