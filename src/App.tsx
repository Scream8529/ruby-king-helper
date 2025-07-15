import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Selected from './pages/Selected';
import {
    AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, ListItemButton, Fab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navLinks = [
    { to: '/', label: 'Все рецепты' },
    { to: '/selected', label: 'Выбранные рецепты' },
];

const App: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Крафт Ruby King
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        {navLinks.map(link => (
                            <ListItem key={link.to} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={link.to}
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box sx={{ p: 2 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/selected" element={<Selected />} />
                </Routes>
            </Box>
            {/* Фиксированная круглая кнопка меню внизу экрана */}
            <Fab
                color="primary"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: '10px',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    width: 64,
                    height: 64,
                }}
            >
                <MenuIcon sx={{ fontSize: 32 }} />
            </Fab>
        </Router>
    );
};

export default App;