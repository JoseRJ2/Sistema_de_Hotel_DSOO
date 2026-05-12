import { useState } from 'react';

export const useBitacoraRestaurante = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const consultarBitacora = async (inicio: string, fin: string) => {
    setCargando(true);
    setMensaje("");
    try {
      const res = await fetch(`/api/restaurante/bitacora?fechaInicio=${inicio}&fechaFin=${fin}`);
      const data = await res.json();
      
      // BLINDAJE: Verificamos si la respuesta es correcta y es un arreglo
      if (res.ok && Array.isArray(data)) {
        if (data.length === 0) {
          setMensaje("No hay movimientos en este rango de fechas");
        }
        setRegistros(data);
      } else {
        // Si el servidor mandó un error, mostramos el mensaje y dejamos la lista vacía
        setMensaje(data.error || "Error al obtener la bitácora");
        setRegistros([]);
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
      setRegistros([]); // Si hay error de red, forzamos que sea un arreglo vacío
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoReserva = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch('/api/restaurante/bitacora', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nuevoEstado }),
      });
      if (res.ok) {
        // Actualizamos la lista localmente para no volver a llamar al API
        setRegistros(prev => prev.map(reg => 
          reg.id_servicio_restaurante === id ? { ...reg, estado: nuevoEstado } : reg
        ));
      }
    } catch (error) {
      alert("Error al cambiar estado");
    }
  };

  return { registros, cargando, mensaje, consultarBitacora, cambiarEstadoReserva };
};