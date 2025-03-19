import React from 'react';
import { Box, AppBar, Toolbar, Typography, CssBaseline, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1201,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #4caf50 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            Consultorio Médico
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: { xs: 2, sm: 3 },
          mt: 8,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
