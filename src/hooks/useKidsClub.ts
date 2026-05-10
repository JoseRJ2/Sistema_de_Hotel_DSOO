import { useState, ChangeEvent, FormEvent } from 'react';

export interface KidsClubFormData {
  nombreNino: string;
  edadNino: number;
  actividad: string;
  fecha: string;
  alergias: string; 
}

export const useKidsClub = () => {
  const [formData, setFormData] = useState<KidsClubFormData>({
    nombreNino: '',
    edadNino: 4, 
    actividad: '',
    fecha: '',
    alergias: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edadNino' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Inscripción de Kids Club procesada en .ts:', formData);
    alert(`¡Inscripción para ${formData.nombreNino} preparada con éxito! (Revisa la consola)`);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};