import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#1e1e1e', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <Typography variant="body2">
        Supply Chain Dashboard © 2024
      </Typography>
    </Box>
  );
};

export default Footer;
