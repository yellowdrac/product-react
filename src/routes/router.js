import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsPage from '../pages/clients'; // Importa tu página de clientes

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ClientsPage />} />
                {/* Otras rutas aquí */}
            </Routes>
        </Router>
    );
}