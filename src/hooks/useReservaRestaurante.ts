import { useState, ChangeEvent, FormEvent } from 'react';

export interface ReservaFormData {
  fecha: string;
  turno: string;
  personas: number;
  tipoServicio: string;
}

export const useReservaRestaurante = () => {
  const [formData, setFormData] = useState<ReservaFormData>({
    fecha: '',
    turno: '',
    personas: 1,
    tipoServicio: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'personas' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Lógica ejecutada en .ts! Datos listos:', formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};