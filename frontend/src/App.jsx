import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  // Estado del usuario global (puede venir de localStorage)
  const [user, setUser] = useState(null);

  // Al cargar la app, chequea si hay usuario guardado
  useEffect(() => {
    const storedUser = localStorage.getItem("hemoapp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("hemoapp_user");
    setUser(null);
  };

  // Actualizar datos del usuario (desde ProfilePage)
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("hemoapp_user", JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <Routes>
        {/* Página de registro */}
        <Route
          path="/"
          element={<RegisterPage onRegister={(newUser) => setUser(newUser)} />}
        />

        {/* Onboarding: se muestra solo si hay usuario */}
        <Route
          path="/onboarding"
          element={
            user ? <OnboardingPage user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/" />
          }
        />

        {/* Perfil: también solo si hay usuario */}
        <Route
          path="/perfil"
          element={
            user ? (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Dashboard: también necesita usuario */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
