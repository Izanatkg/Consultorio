import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medicalHistory?: string;
}

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (err: any) {
        console.error('Error al cargar pacientes:', err);
        setError(err.response?.data?.message || 'Error al cargar los pacientes');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      try {
        await api.delete(`/patients/${id}`);
        setPatients(patients.filter(patient => patient._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar el paciente');
      }
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Femenino';
      case 'Otro':
        return 'Otro';
      default:
        return gender;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196f3 30%, #4caf50 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Pacientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Nuevo Paciente
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Edad</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay pacientes registrados
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age} años</TableCell>
                  <TableCell>
                    <Chip 
                      label={getGenderLabel(patient.gender)}
                      size="small"
                      sx={{ 
                        bgcolor: patient.gender === 'M' ? '#e3f2fd' : 
                                patient.gender === 'F' ? '#fce4ec' : '#f3e5f5',
                      }}
                    />
                  </TableCell>
                  <TableCell>{patient.email || '-'}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(patient._id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Patients;
