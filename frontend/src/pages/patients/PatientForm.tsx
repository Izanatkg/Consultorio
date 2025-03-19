import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import api from '../../config/api';

interface PatientFormData {
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  birthDate: Date | null;
  address: string;
  medicalHistory: string;
}

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    age: 0,
    gender: '',
    email: '',
    phone: '',
    birthDate: null,
    address: '',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/patients/${id}`);
          const patient = response.data;
          setFormData({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            email: patient.email,
            phone: patient.phone,
            birthDate: patient.birthDate ? new Date(patient.birthDate) : null,
            address: patient.address || '',
            medicalHistory: patient.medicalHistory || ''
          });
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error al cargar el paciente');
        } finally {
          setLoading(false);
        }
      };

      fetchPatient();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        age: Number(formData.age)
      };

      if (isEditing) {
        await api.put(`/patients/${id}`, dataToSend);
      } else {
        await api.post('/patients', dataToSend);
      }
      navigate('/patients');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el paciente');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (loading && isEditing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196f3 30%, #4caf50 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                label="Edad"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                inputProps={{ min: 0, max: 150 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Género</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Género"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={formData.birthDate}
                onChange={(date) => setFormData({ ...formData, birthDate: date })}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Historial Médico"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                multiline
                rows={4}
                helperText="Incluya información relevante sobre condiciones médicas, alergias, medicamentos, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/patients')}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientForm;