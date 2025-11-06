/**
 * LoginPage.jsx - Página de inicio de sesión
 *
 * ¿Qué hace?
 * - Permite a usuarios registrados acceder a la aplicación
 * - Valida las credenciales del usuario contra localStorage
 * - Redirige al dashboard después del login exitoso
 *
 * ¿Cómo funciona?
 * - Compara el email y contraseña ingresados con los usuarios almacenados
 * - Si las credenciales coinciden: llama a onLogin y navega al dashboard
 * - Si no coinciden: muestra un mensaje de error
 *
 * Props:
 * - onLogin: Función que actualiza el estado de autenticación en App.jsx
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";

export default function LoginPage({ onLogin }) {
  // Estados para almacenar los valores del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook para navegación programática
  const { toast } = useToast(); // Hook para mostrar notificaciones

  /**
   * handleSubmit - Maneja el envío del formulario de login
   * ¿Qué hace?
   * - Previene el comportamiento por defecto del formulario
   * - Busca el usuario en localStorage
   * - Valida las credenciales
   * - Muestra mensajes de éxito o error
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Recupera todos los usuarios registrados del localStorage
    const users = JSON.parse(localStorage.getItem("hemoapp_users") || "[]");
    // Busca un usuario que coincida con el email y contraseña ingresados
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      onLogin(user);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Credenciales incorrectas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Iniciar Sesión
          </CardTitle>
          <CardDescription>Ingresa a tu cuenta de HemoApp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Entrar
            </Button>
            <div className="text-center">
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="text-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
              </span>
              <Link
                to="/register"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
