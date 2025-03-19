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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../config/api';
import { Appointment } from '../../types/appointment';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    date: null as Date | null,
    status: 'all',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err: any) {
      console.error('Error al cargar citas:', err);
      setError(err.response?.data?.message || 'Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta cita?')) {
      try {
        await api.delete(`/appointments/${id}`);
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar la cita');
      }
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Programada':
        return {
          color: 'primary',
          bgcolor: '#e3f2fd',
        };
      case 'Completada':
        return {
          color: 'success',
          bgcolor: '#e8f5e9',
        };
      case 'Cancelada':
        return {
          color: 'error',
          bgcolor: '#ffebee',
        };
      default:
        return {
          color: 'default',
          bgcolor: '#f5f5f5',
        };
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filters.status !== 'all' && appointment.status !== filters.status) {
      return false;
    }
    if (filters.date) {
      const appointmentDate = new Date(appointment.date).toDateString();
      const filterDate = filters.date.toDateString();
      if (appointmentDate !== filterDate) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
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
          Citas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Nueva Cita
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Filtrar por fecha"
              value={filters.date}
              onChange={(newDate) => setFilters({ ...filters, date: newDate })}
              sx={{ width: 200 }}
            />
          </LocalizationProvider>

          <FormControl sx={{ width: 200 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status}
              label="Estado"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Programada">Programadas</MenuItem>
              <MenuItem value="Completada">Completadas</MenuItem>
              <MenuItem value="Cancelada">Canceladas</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hora</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay citas programadas
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    {format(new Date(appointment.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {appointment.patient.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patient.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusChipColor(appointment.status).bgcolor,
                        color: `${getStatusChipColor(appointment.status).color}.main`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/appointments/edit/${appointment._id}`)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(appointment._id)}
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

export default Appointments;
