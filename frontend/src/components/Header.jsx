/**
 * Header.jsx - Componente de encabezado de la aplicación
 *
 * ¿Qué hace?
 * - Muestra la barra de navegación superior en todas las páginas autenticadas
 * - Proporciona enlaces rápidos al perfil y dashboard
 * - Permite cerrar sesión
 *
 * ¿Para qué sirve?
 * - Navegación consistente en toda la aplicación
 * - Acceso rápido a funciones principales
 * - Identificación visual de la marca HemoApp
 *
 * Props:
 * - user: Datos del usuario actual
 * - onLogout: Función para cerrar sesión
 */

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  /**
   * handleLogout - Maneja el cierre de sesión
   * ¿Qué hace?
   * - Llama a la función onLogout para limpiar el estado
   * - Redirige al usuario a la página de inicio
   */
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="bg-foreground py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="HemoApp" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-accent">
            Hemo<span className="font-normal text-primary-foreground">App</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button className="bg-accent hover:bg-accent/90">Inicio</Button>
          </Link>
          <Link to="/perfil">
            <Button
              variant="outline"
              className="text-primary border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Mi Perfil
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
