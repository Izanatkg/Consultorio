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
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import api from '../../config/api';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const Dashboard: React.FC = () => {
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

  const stats = {
    totalPatients: patients.length,
    appointments: 0, // Se implementará más adelante
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
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
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
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
        Panel de Control
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  color: 'primary.main',
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Pacientes
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                pacientes registrados
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
                Nuevo
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  color: 'secondary.main',
                }}
              >
                <EventIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Citas
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {stats.appointments}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                citas programadas
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
                Nueva
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
