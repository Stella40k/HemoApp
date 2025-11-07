/**
 * App.jsx - Componente principal de la aplicación HemoApp
 *
 * ¿Qué hace?
 * - Define el punto de entrada principal de la aplicación
 * - Gestiona el estado de autenticación del usuario
 * - Define todas las rutas de la aplicación (públicas y protegidas)
 * - Persiste la sesión del usuario usando localStorage
 *
 * ¿Cómo funciona?
 * - Usa React Router para manejar la navegación entre páginas
 * - Implementa protección de rutas: redirige usuarios no autenticados a login
 * - Mantiene sincronizado el estado del usuario entre sesiones
 * - Proporciona funciones de login/logout a todos los componentes hijos
 */

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BloodRequestsPage from "./pages/BloodRequestsPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import DonorStatusPage from "./pages/DonorStatusPage";
import RequestBloodPage from "./pages/RequestBloodPage";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado que almacena los datos del usuario actual
  const [user, setUser] = useState(null);

  /**
   * useEffect - Se ejecuta al montar el componente
   * ¿Para qué sirve?
   * - Restaura la sesión del usuario desde localStorage al recargar la página
   * - Permite que el usuario permanezca autenticado entre recargas del navegador
   */
  useEffect(() => {
    // Intenta recuperar los datos del usuario almacenados localmente
    const storedUser = localStorage.getItem("hemoapp_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * handleLogin - Función para iniciar sesión
   * ¿Qué hace?
   * - Guarda los datos del usuario en el estado y localStorage
   * - Marca al usuario como autenticado
   * - Permite el acceso a rutas protegidas
   */
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("hemoapp_user", JSON.stringify(userData));
  };

  /**
   * handleLogout - Función para cerrar sesión
   * ¿Qué hace?
   * - Limpia los datos del usuario del estado
   * - Marca al usuario como no autenticado
   * - Elimina los datos del usuario de localStorage
   * - Redirige al usuario a la página de inicio
   */
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("hemoapp_user");
  };

  /**
   * handleUpdateUser - Función para actualizar datos del usuario
   * ¿Para qué sirve?
   * - Actualiza los datos del usuario en el estado de React
   * - Sincroniza los cambios con localStorage
   * - Permite que los cambios del perfil persistan entre sesiones
   */
  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("hemoapp_user", JSON.stringify(updatedUserData));
  };

  /**
   * Configuración de Rutas de la Aplicación
   *
   * Rutas Públicas (accesibles sin autenticación):
   * - / : Página de inicio (landing page)
   * - /login : Inicio de sesión
   * - /register : Registro de nuevos usuarios
   * - /solicitar-sangre : Formulario público para solicitar sangre
   *
   * Rutas Protegidas (requieren autenticación):
   * - /dashboard : Panel principal del donante
   * - /solicitudes : Ver solicitudes activas de sangre
   * - /mapa : Mapa de centros de donación
   * - /perfil : Perfil y configuración del usuario
   * - /estado-donador : Estado y estadísticas de donaciones
   *
   * ¿Cómo funciona la protección?
   * - Si el usuario está autenticado: muestra la página
   * - Si no está autenticado: redirige a /login
   * - Si está autenticado e intenta acceder a login/register: redirige a /dashboard
   */
  return (
    <Router>
      <Routes>
        {/* Rutas públicas: Accesibles por todos */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage onRegister={handleLogin} />
            )
          }
        />
        {/* Ruta pública para solicitar sangre (puede ser usada por no logueados o familiares) */}
        <Route path="/solicitar-sangre" element={<RequestBloodPage />} />

        {/* Rutas protegidas: Solo para usuarios autenticados */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/solicitudes"
          element={
            isAuthenticated ? (
              <BloodRequestsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/mapa"
          element={
            isAuthenticated ? (
              <MapPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            isAuthenticated ? (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              /> // Usar handleUpdateUser aquí
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/estado-donador"
          element={
            isAuthenticated ? (
              <DonorStatusPage
                user={user}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}
