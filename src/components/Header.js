import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import '../styles/Header.css';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
      <Toolbar>
        <Typography variant="h6" component="div" className="header-title" sx={{ flexGrow: 1 }}>
          Supply Chain Dashboard
        </Typography>
        <Box>
          <Button component={Link} to="/" color="inherit" className="header-link">
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
