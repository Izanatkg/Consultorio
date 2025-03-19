import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../config/api';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
  };
  date: string;
  time: string;
  reason: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments')
        ]);
        setPatients(patientsResponse.data);
        setAppointments(appointmentsResponse.data);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate()
    );
  });

  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear la hora a medianoche
      return appointmentDate >= today && appointment.status === 'Programada';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Resumen de Pacientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Pacientes Registrados
                </Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {patients.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/patients')}
                sx={{ ml: 1 }}
              >
                Ver todos
              </Button>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/patients/new')}
                sx={{ ml: 1 }}
              >
                Nuevo Paciente
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Resumen de Citas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EventIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Citas de Hoy
                </Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {todayAppointments.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/appointments')}
                sx={{ ml: 1 }}
              >
                Ver todas
              </Button>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/appointments/new')}
                sx={{ ml: 1 }}
              >
                Nueva Cita
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Próximas Citas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Próximas Citas
              </Typography>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Box
                    key={appointment._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {appointment.patient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(appointment.date), 'EEEE d MMMM, yyyy', { locale: es })} - {appointment.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.reason}
                        </Typography>
                      </Box>
                      <Chip
                        label={appointment.status}
                        sx={{
                          color: getStatusChipColor(appointment.status).color + '.main',
                          bgcolor: getStatusChipColor(appointment.status).bgcolor,
                        }}
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No hay citas programadas próximamente
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/appointments')}>
                Ver todas las citas
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
