import { useState, ChangeEvent, FormEvent } from 'react';

export interface ReservaFormData {
  fecha: string;
  turno_hora: string; 
  personas: number;
  tipo_servicio: 'A_LA_CARTA' | 'BUFFET' | '';
}

export const useReservaRestaurante = () => {
  const [formData, setFormData] = useState<ReservaFormData>({
    fecha: '',
    turno_hora: '',
    personas: 1,
    tipo_servicio: '',
  });

  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' | '' }>({ texto: '', tipo: '' });
  
  // Simulación del objeto Cliente basado en la base de datos
  // El ID 1 corresponde a 'Juan Pérez' que insertamos en el SQL
  const clienteActual = { 
    id: 1, 
    nombre: 'Juan Pérez (Estándar)', 
    membresia: 'CLIENTE_REGULAR' // Cámbialo a 'CLIENTE_PREMIUM' o 'CLIENTE_VIP' para probar otros flujos
  }; 

  const CAPACIDAD_TOTAL = 50;
  
  // Mantenemos la ocupación en 0 para que no te bloquee por disponibilidad al hacer pruebas iniciales
  const ocupacionSimulada = 0; 

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'personas' ? Number(value) : value,
    }));
  };

  // Método extraído del Diagrama de Clases
  const verificarDisponibilidad = (personas: number, membresia: string): boolean => {
    const capacidadDisponible = CAPACIDAD_TOTAL - ocupacionSimulada;
    const porcentajeOcupacion = (ocupacionSimulada / CAPACIDAD_TOTAL) * 100;

    // E1: No hay cupo físico
    if (capacidadDisponible < personas) {
      setMensaje({ texto: "No hay mesas disponibles para este grupo.", tipo: 'error' });
      return false;
    }

    // Regla de Negocio: Retención del 30% para VIP/Premium
    if (porcentajeOcupacion >= 70 && membresia === 'CLIENTE_REGULAR') {
      setMensaje({ 
        texto: "Disponibilidad restringida: El cupo restante es exclusivo para socios Premium/VIP.", 
        tipo: 'error' 
      });
      return false;
    }
    
    return true;
  };

  // Método extraído del Diagrama de Clases
  const enviarTicketNotificacion = () => {
    console.log("Notificación: Ticket digital generado y enviado al cliente.");
  };

  // Método extraído del Diagrama de Clases y Secuencia
  const registrarReserva = async (datos: ReservaFormData) => {
    try {
      // 1. Mapeamos el 'turno_hora' del formulario al ENUM y al bloque de texto para la BD
      const mapping: Record<string, { turno: 'DESAYUNO' | 'COMIDA' | 'CENA', bloque: string }> = {
        desayuno_temprano: { turno: 'DESAYUNO', bloque: '07:00 - 09:00' },
        desayuno_tarde:    { turno: 'DESAYUNO', bloque: '09:30 - 11:30' },
        comida_temprano:   { turno: 'COMIDA',   bloque: '13:00 - 15:00' },
        comida_tarde:      { turno: 'COMIDA',   bloque: '15:30 - 17:30' },
        cena_temprano:     { turno: 'CENA',     bloque: '19:00 - 21:00' },
        cena_tarde:        { turno: 'CENA',     bloque: '21:30 - 23:30' },
      };

      const { turno, bloque } = mapping[datos.turno_hora];

      // 2. Preparamos el objeto estructurado exactamente como lo pide la nueva tabla ServicioRestaurante
      const reservaParaBD = {
        id_cliente: clienteActual.id,
        fecha: new Date(datos.fecha).toISOString(), // Formato seguro para BD
        turno: turno,
        hora_bloque: bloque,
        cantidad_personas: datos.personas,
        tipo_servicio: datos.tipo_servicio,
        estado: 'PENDIENTE'
      };

      console.log('Objeto listo para ser enviado a la BD:', reservaParaBD);

      // 3. LLAMADA A LA API (Comentada hasta que crees tu ruta en Next.js)
      // 3. LLAMADA A LA API REAL
      const response = await fetch('/api/restaurante/reserva', {
        method: 'POST',
        body: JSON.stringify(reservaParaBD),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar en la base de datos");
      }

      // 4. Éxito de la operación
      setMensaje({ texto: "¡Reserva confirmada exitosamente! Se ha enviado su ticket digital.", tipo: 'exito' });
      enviarTicketNotificacion();
      
      // S1.1 Limpiar formulario tras éxito
      setFormData({ fecha: '', turno_hora: '', personas: 1, tipo_servicio: '' });

    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error al procesar la reserva con el servidor.", tipo: 'error' });
    }
  };

  // Controlador de la vista
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    // Ejecuta el flujo validando disponibilidad primero
    const hayCupo = verificarDisponibilidad(formData.personas, clienteActual.membresia);
    if (hayCupo) {
      await registrarReserva(formData);
    }
  };

  return { formData, handleChange, handleSubmit, mensaje, clienteActual };
};