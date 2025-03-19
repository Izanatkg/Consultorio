export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age?: number;
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  address?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age?: number;
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  address?: string;
  medicalHistory?: string;
}