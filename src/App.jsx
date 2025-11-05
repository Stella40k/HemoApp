import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BloodRequestsPage from './pages/BloodRequestsPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import DonorStatusPage from './pages/DonorStatusPage';
import RequestBloodPage from './pages/RequestBloodPage';
import { Toaster } from './components/ui/toaster';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (localStorage)
    const storedUser = localStorage.getItem('hemoapp_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      // Opcional: Llamar a la función de actualización aquí si es necesario
      // handleUpdateUser(userData); 
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('hemoapp_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hemoapp_user');
  };

  // **********************************************
  // CORRECCIÓN CRÍTICA: DEFINICIÓN DE LA FUNCIÓN FALTANTE
  // **********************************************
  const handleUpdateUser = (updatedUserData) => {
    // 1. Actualiza el estado local de React
    setUser(updatedUserData); 
    // 2. Actualiza el almacenamiento local (localStorage)
    localStorage.setItem('hemoapp_user', JSON.stringify(updatedUserData)); 
  };
  // **********************************************

  return (
    <Router>
      <Routes>
        {/* Rutas públicas: Accesibles por todos */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <RegisterPage onRegister={handleLogin} />
          } 
        />
        {/* Ruta pública para solicitar sangre (puede ser usada por no logueados o familiares) */}
        <Route path="/solicitar-sangre" element={<RequestBloodPage />} />

        {/* Rutas protegidas: Solo para usuarios autenticados */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <DashboardPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/solicitudes" 
          element={
            isAuthenticated ? 
            <BloodRequestsPage user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/mapa" 
          element={
            isAuthenticated ? 
            <MapPage user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/perfil" 
          element={
            isAuthenticated ? 
            <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : // Usar handleUpdateUser aquí
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/estado-donador" 
          element={
            isAuthenticated ? 
            <DonorStatusPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}