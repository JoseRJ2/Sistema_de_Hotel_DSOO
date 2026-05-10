import { useState, ChangeEvent, FormEvent } from 'react';

export interface ReservaFormData {
  fecha: string;
  turno: string; 
  personas: number;
  tipo_servicio: 'A_LA_CARTA' | 'BUFFET' | '';
}

export const useReservaRestaurante = () => {
  const [formData, setFormData] = useState<ReservaFormData>({
    fecha: '',
    turno: '',
    personas: 1,
    tipo_servicio: '',
  });

  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' | '' }>({ texto: '', tipo: '' });
  
  const clienteActual = { id: 1, nombre: 'Juan Pérez', membresia: 'CLIENTE_REGULAR' }; 

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'personas' ? Number(value) : value }));
  };

  // ------------------------------------------------------------------
  // MÉTODOS EXACTOS DEL DIAGRAMA DE CLASES Y SECUENCIA (INTERFAZ)
  // ------------------------------------------------------------------

  const mostrarAlerta = (mensajeAlerta: string) => {
    setMensaje({ texto: mensajeAlerta, tipo: 'error' });
  };

  const mostrarConfirmacion = (res: any) => {
    setMensaje({ texto: `¡Reserva confirmada! ID: ${res.id_servicio}`, tipo: 'exito' });
  };

  const ingresarNuevosDatos = (fecha: string, turno: string) => {
    // Retorno de acción al cliente (limpia o pre-llena)
    setFormData({ fecha, turno, personas: 1, tipo_servicio: '' });
  };

  // ------------------------------------------------------------------
  // MÉTODOS EXACTOS DEL DIAGRAMA DE COMUNICACIÓN Y SECUENCIA (GESTOR)
  // ------------------------------------------------------------------

  // 1: reservarMesa(fecha, turno, comensales)
  const reservarMesa = async (fecha: string, turno: string, comensales: number) => {
    try {
      const response = await fetch('/api/restaurante/reserva', {
        method: 'POST',
        body: JSON.stringify({
          id_cliente: clienteActual.id,
          fecha: fecha,
          turno_hora: turno,
          comensales: comensales,
          tipo_servicio: formData.tipo_servicio,
          membresia: clienteActual.membresia
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        // mostrarAlerta("Sin disponibilidad...") -> Dictado por el diagrama de secuencia
        mostrarAlerta("Sin disponibilidad o error en el servidor");
        return;
      }

      // mostrarConfirmacion(res) -> Dictado por el diagrama de secuencia
      mostrarConfirmacion(data.res);
      ingresarNuevosDatos('', ''); // Limpiamos el formulario

    } catch (error) {
      mostrarAlerta("Error de conexión");
    }
  };

  // Método de la clase InterfazReservasRestaurante
  const capturarDatosReserva = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    
    // Llamada inicial del flujo: 1: reservarMesa
    await reservarMesa(formData.fecha, formData.turno, formData.personas);
  };

  return { 
    formData, 
    handleChange, 
    capturarDatosReserva, // <- Nuevo nombre del método (antes handleSubmit)
    mensaje, 
    clienteActual         // <- Faltaba exportar esto
  };
};