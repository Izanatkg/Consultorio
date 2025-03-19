import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';

interface Patient {
  _id: string;
  name: string;
}

interface AppointmentFormData {
  patientId: string;
  date: Date | null;
  time: string;
  reason: string;
  notes?: string;
}

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    date: null,
    time: '',
    reason: '',
    notes: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPatients();
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      setError('Error al cargar la lista de pacientes');
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          patientId: data.patient._id,
          date: new Date(data.date),
          time: data.time,
          reason: data.reason,
          notes: data.notes || ''
        });
      }
    } catch (error) {
      console.error('Error al obtener cita:', error);
      setError('Error al cargar los datos de la cita');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    try {
      const url = id 
        ? `http://localhost:5000/api/appointments/${id}`
        : 'http://localhost:5000/api/appointments';
      
      const method = id ? 'PUT' : 'POST';
      
      console.log('Enviando datos:', formData);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar la cita');
      }

      navigate('/appointments');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar la cita');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  return (
    <Box p={3}>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            {id ? 'Editar Cita' : 'Nueva Cita'}
          </Typography>
          
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Paciente</InputLabel>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    label="Paciente"
                    onChange={handleSelectChange}
                  >
                    {patients.map(patient => (
                      <MenuItem key={patient._id} value={patient._id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Hora"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300 // 5 minutos
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Motivo de la cita"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas adicionales"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/appointments')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {id ? 'Actualizar' : 'Crear'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppointmentForm;
