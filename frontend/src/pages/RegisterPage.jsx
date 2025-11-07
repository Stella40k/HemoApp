/**
 * RegisterPage.jsx - Página de registro de nuevos usuarios
 * * Alineación con Backend:
 * - Envía los campos userName, email, password (Nivel superior).
 * - Envía los campos profileData: {firstName, lastName, dni, birthDate, gender, bloodType, factor} (Anidados).
 * - Se eliminó la lógica de donaciones previas que no es parte del registro inicial del backend.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// import PropTypes from "prop-types"; // Se puede eliminar si no se usa

export default function RegisterPage({ onRegister }) {
  // ⬅️ CORRECCIÓN 1: ÚNICA DECLARACIÓN DE ESTADO CON CAMPOS REQUERIDOS 💥
  const [formData, setFormData] = useState({
    // CAMPOS DE NIVEL SUPERIOR
    userName: "", // ⬅️ AGREGADO (Requerido)
    email: "",
    password: "",
    // CAMPOS ANIDADOS (profileData)
    firstName: "",
    lastName: "",
    dni: "", // ⬅️ AGREGADO (Requerido)
    birthDate: "", // ⬅️ AGREGADO (Requerido)
    bloodType: "",
    factor: "", // ⬅️ AGREGADO (Requerido por bloodType en el modelo)
    gender: "", // ⬅️ RENOMBRADO (Era 'status')
    // weight se mantiene aunque no sea crítico para el registro inicial
    weight: "", 
  });
  // Se elimina toda la lógica de 'donations', 'showDonationForm', y 'donationEntry'
  
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * handleSubmit - Procesa el registro del nuevo usuario
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // ⬅️ CORRECCIÓN 2: ESTRUCTURA DEL PAYLOAD ALINEADA AL BACKEND 💥
    const payload = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        
        profileData: { // OBJETO ANIDADO REQUERIDO
            firstName: formData.firstName,
            lastName: formData.lastName,
            dni: formData.dni,
            birthDate: formData.birthDate,
            gender: formData.gender,
            bloodType: formData.bloodType,
            factor: formData.factor,
        },
        // weight no se incluye en profileData por ahora, ya que va a medicalProfile
        // y el controlador actual no lo mapea en el registro, pero el modelo lo acepta después.
    };

    // --- SIMULACIÓN DE GUARDADO (Backend Simulado) ---
    const users = JSON.parse(localStorage.getItem("hemoapp_users") || "[]");
    
    // Check de unicidad simulado (básico)
    if (users.some(u => u.userName === payload.userName || u.email === payload.email || u.profileData.dni === payload.profileData.dni)) {
        toast({
            title: "Error",
            description: "Usuario, DNI o Email ya existe.",
            variant: "destructive",
        });
        return;
    }

    const newUser = {
        id: Date.now().toString(), 
        ...payload,
        profileData: payload.profileData, 
        donationStatus: "inactive",
        accountStatus: "unverified", // Coherente con el backend
    };
    
    users.push(newUser);
    localStorage.setItem("hemoapp_users", JSON.stringify(users));

    // Autentica automáticamente (llama a onRegister)
    onRegister(newUser); 
    toast({
      title: "¡Registro exitoso!",
      description: "Por favor, verifica tu email para activar la cuenta.",
    });
    // El backend redirige a ONBOARDING, pero por ahora vamos al dashboard simulado
    navigate("/dashboard"); 
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Crear Cuenta
          </CardTitle>
          <CardDescription>Únete a la comunidad de donantes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ⬅️ CAMPO NUEVO: USERNAME 💥 */}
            <div className="space-y-2">
                <Label htmlFor="userName">Nombre de Usuario</Label>
                <Input
                    id="userName"
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
            </div>

            {/* NOMBRE y APELLIDO */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* DNI y FECHA DE NACIMIENTO (Nuevos, Requeridos) 💥 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                        id="dni"
                        type="text"
                        required
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        minLength={7}
                        maxLength={8}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                        id="birthDate"
                        type="date" // Usamos type date para el selector
                        required
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                </div>
            </div>

            {/* EMAIL y CONTRASEÑA */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6} // Min 6 requerido por el backend
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            
            {/* TIPO DE SANGRE, FACTOR, PESO (Nuevos/Corregidos) 💥 */}
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bloodType">Tipo de Sangre</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, bloodType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                
                {/* CAMPO FACTOR (Nuevo) */}
                <div className="space-y-2">
                    <Label htmlFor="factor">Factor</Label>
                    <Select
                        value={formData.factor}
                        onValueChange={(value) => setFormData({ ...formData, factor: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Factor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="positive">Positivo (+)</SelectItem>
                            <SelectItem value="negative">Negativo (-)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* PESO (medicalProfile) */}
                <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        min={30}
                        required
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                </div>
            </div>

            {/* GÉNERO (RENOMBRADO de 'status') 💥 */}
            <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* SE ELIMINA el bloque de Donaciones Previas (Optional: add past donations) */}
            
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              size="lg"
            >
              Crear Cuenta
            </Button>
            <div className="text-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
              </span>
              <Link
                to="/login"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}