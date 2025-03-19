import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../../store';
import { setPatients } from '../../store/slices/patientSlice';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading } = useSelector((state: RootState) => state.patient);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        console.log('Token almacenado:', storedToken);
        
        if (!storedToken) {
          console.error('No hay token en localStorage');
          navigate('/login');
          return;
        }

        console.log('Haciendo petición a /api/patients...');
        const response = await fetch('http://localhost:3000/api/patients', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error de la API:', errorData);
          throw new Error(errorData.message || 'Error al obtener pacientes');
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        dispatch(setPatients(data));
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
      }
    };

    fetchPatients();
  }, [dispatch, navigate]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Pacientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
        >
          Nuevo Paciente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Cargando...</TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay pacientes registrados</TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id} hover>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/patients/${patient._id}`)}
                    >
                      Editar
                    </Button>
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

export default PatientList;