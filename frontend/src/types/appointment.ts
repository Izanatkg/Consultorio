import { Patient } from './patient';

export interface Appointment {
  _id: string;
  patient: Patient;
  date: string;
  time: string;
  reason: string;
  status: 'Programada' | 'Completada' | 'Cancelada';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: 'Programada' | 'Completada' | 'Cancelada';
  notes?: string;
}
