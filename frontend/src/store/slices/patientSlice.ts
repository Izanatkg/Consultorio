import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient>) => {
      state.selectedPatient = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    }
  }
});

export const { 
  setPatients, 
  setSelectedPatient, 
  setLoading, 
  setError, 
  clearSelectedPatient 
} = patientSlice.actions;

export default patientSlice.reducer;