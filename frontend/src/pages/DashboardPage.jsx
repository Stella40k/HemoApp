/**
 * DashboardPage.jsx - Panel principal del donante autenticado
 *
 * ¿Qué hace?
 * - Muestra la página principal después del login
 * - Proporciona navegación a las 3 funciones principales de la app
 * - Da la bienvenida al usuario
 *
 * ¿Para qué sirve?
 * - Hub central de navegación para usuarios autenticados
 * - Acceso rápido a las funcionalidades principales
 * - Orientar al usuario sobre qué puede hacer en la app
 *
 * Funcionalidades principales:
 * 1. Donar: Ver solicitudes activas de sangre y responder
 * 2. Mapa: Encontrar centros de donación cercanos
 * 3. Estado como donador: Ver perfil, estadísticas e historial
 *
 * Props:
 * - user: Datos del usuario actual
 * - onLogout: Función para cerrar sesión
 */

import { Link } from "react-router-dom";
import Header from "@/components/Header";
import botonDonar from "@/assets/boton-donar.png";
import botonMapa from "@/assets/boton-mapa.png";
import botonEstado from "@/assets/boton-estado.png";
import PropTypes from "prop-types";

export default function DashboardPage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-background"> 
      <Header user={user} onLogout={onLogout} />

     <div className="bg-gradient-to-b from-secondary  to-background  py-20 px-6 relative overflow-hidden min-h-[600px]">
      <div className="container mx-auto py-12 px-6 relative z-10">
        {/* Logo y bienvenida */}
        <div className="text-center mb-12 ">
          <h1 className="text-3xl font-bold text-foreground mb-2 ">
            ¡Hola, {user?.firstName || user?.userName || 'Donante'}!
          </h1>
          <h1 className="text-4xl font-bold text-accent mb-2">
            ¿Qué quieres ver hoy?
          </h1>
        </div>
     </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link to="/solicitudes" className="group">
            <div className="text-center transition-transform hover:scale-105">
              <div className="mb-4">
                <img
                  src={botonDonar}
                  alt="Donar"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-accent">Donar</h3>
            </div>
          </Link>

          <Link to="/mapa" className="group">
            <div className="text-center transition-transform hover:scale-105">
              <div className="mb-4">
                <img
                  src={botonMapa}
                  alt="Mapa"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-accent">Mapa</h3>
            </div>
          </Link>

          <Link to="/estado-donador" className="group">
            <div className="text-center transition-transform hover:scale-105">
              <div className="mb-4">
                <img
                  src={botonEstado}
                  alt="Estado como donador"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-accent">
                Estado como donador
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

DashboardPage.propTypes = {
  user: PropTypes.any,
  onLogout: PropTypes.func.isRequired,
};
