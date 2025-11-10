/**
 * Header.jsx - Componente de encabezado de la aplicación (CORREGIDO)
 */

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="bg-foreground py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* 1. Logo y Nombre de la App (DEBE ESTAR SOLO) */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="HemoApp" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-accent">
            Hemo<span className="font-normal text-primary-foreground">App</span>
          </span>
        </Link>
        
        {/* 2. Botones de Navegación (DEBE ESTAR FUERA DEL LINK DEL LOGO) */}
        <div className="flex items-center gap-4"> 
          
          <Link to="/solicitar-sangre">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              Necesito recibir una donación
            </Button>
          </Link>
          
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