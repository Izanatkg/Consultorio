import React from 'react';
import { Box, Typography } from '@mui/material';

const Appointments: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Citas
      </Typography>
      {/* TODO: Implementar lista de citas */}
    </Box>
  );
};

export default Appointments;
