import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface ReservaFormData {
  fecha: string;
  turno: string; 
  personas: number;
  tipo_servicio: 'A_LA_CARTA' | 'BUFFET' | '';
}

export const useReservaRestaurante = () => {
  const { usuario } = useAuth();

  const [formData, setFormData] = useState<ReservaFormData>({
    fecha: '',
    turno: '',
    personas: 1,
    tipo_servicio: '',
  });

  const [turnosDisponibles, setTurnosDisponibles] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' | '' }>({ texto: '', tipo: '' });
  
  const clienteActual = { 
    id: usuario?.id_cliente || 0, 
    nombre: usuario?.nombre_completo || 'Usuario', 
    membresia: usuario?.tipo_cliente || 'ESTANDAR' 
  }; 

  // Función para consultar disponibilidad al API
  const checkDisponibilidad = async (fecha: string) => {
    if (!fecha) return;
    try {
      const res = await fetch(`/api/restaurante/disponibilidad?fecha=${fecha}&membresia=${clienteActual.membresia}`);
      const data = await res.json();
      setTurnosDisponibles(data.turnosDisponibles || []);
      
      // Si el turno que estaba seleccionado ya no está disponible en la nueva fecha, lo limpiamos
      if (formData.turno && !data.turnosDisponibles.includes(formData.turno)) {
        setFormData(prev => ({ ...prev, turno: '' }));
      }
    } catch (error) {
      console.error("Error cargando disponibilidad:", error);
    }
  };

  // Escuchar cambios en la fecha para actualizar turnos
  useEffect(() => {
    if (formData.fecha) {
      checkDisponibilidad(formData.fecha);
    } else {
      setTurnosDisponibles([]);
    }
  }, [formData.fecha]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'personas' ? Number(value) : value }));
  };

  const reservarMesa = async (fecha: string, turno: string, comensales: number) => {
    if (!clienteActual.id || clienteActual.id === 0) {
       setMensaje({ texto: "Error: Debes iniciar sesión como cliente.", tipo: 'error' });
       return;
    }

    try {
      const response = await fetch('/api/restaurante/reserva', {
        method: 'POST',
        body: JSON.stringify({
          id_cliente: clienteActual.id,
          fecha,
          turno_hora: turno,
          comensales,
          tipo_servicio: formData.tipo_servicio,
          membresia: clienteActual.membresia
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje({ texto: data.message || "Error al reservar", tipo: 'error' });
        return;
      }

      setMensaje({ texto: `¡Reserva confirmada! ID: ${data.res.id_servicio_restaurante}`, tipo: 'exito' });
      setFormData({ fecha: '', turno: '', personas: 1, tipo_servicio: '' });

    } catch (error) {
      setMensaje({ texto: "Error de conexión", tipo: 'error' });
    }
  };

  const capturarDatosReserva = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    await reservarMesa(formData.fecha, formData.turno, formData.personas);
  };

  return { formData, handleChange, capturarDatosReserva, mensaje, clienteActual, turnosDisponibles };
};