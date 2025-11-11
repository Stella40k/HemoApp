/**
 * ProfilePage.jsx - Página de perfil del usuario con datos del Onboarding
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Award, Heart, Droplet, LogOut, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage({ user, onLogout, onUpdateUser }) {
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    bloodType: user.bloodType || "",
    weight: user.weight || "",
    donatedBefore: user.donatedBefore || "",
    tattoosPiercings: user.tattoosPiercings || "",
    tattooDate: user.tattooDate || "",
    medications: user.medications || "",
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }));
    }
  }, [user]);

  // 📸 Cargar foto de perfil
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setProfileImage(imageUrl);
      const updatedUser = { ...user, profileImage: imageUrl };
      onUpdateUser(updatedUser);
      localStorage.setItem("hemoapp_user", JSON.stringify(updatedUser));
      toast({ title: "Foto actualizada", description: "Tu foto de perfil se ha actualizado correctamente" });
    };
    reader.readAsDataURL(file);
  };

  // 🔄 Guardar perfil actualizado
  const handleUpdateProfile = () => {
    const updatedUser = { ...user, ...formData };
    onUpdateUser(updatedUser);
    localStorage.setItem("hemoapp_user", JSON.stringify(updatedUser));
    setIsEditing(false);
    toast({ title: "Perfil actualizado", description: "Tus datos se han actualizado correctamente" });
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const getInitials = () =>
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const badges = [
    { id: 1, name: "Primera Donación", icon: Heart, color: "bg-accent" },
    { id: 2, name: "5 Donaciones", icon: Droplet, color: "bg-primary" },
    { id: 3, name: "Donante Regular", icon: Award, color: "bg-yellow-500" },
  ];

  const userDonations = user.donations || [];
  const donationCount = userDonations.length;
  const lastDonationDate = userDonations[userDonations.length - 1]?.date || "N/A";
  const livesSaved = donationCount * 3;

  // 📅 Calcular tiempo desde tatuaje/piercing
  const tattooDaysAgo = formData.tattooDate
    ? Math.floor((Date.now() - new Date(formData.tattooDate)) / (1000 * 60 * 60 * 24))
    : null;
  const canDonateAgain = tattooDaysAgo ? tattooDaysAgo >= 365 : true;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Perfil */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={profileImage || undefined} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-accent-foreground" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  {!isEditing ? (
                    <>
                      <h1 className="text-3xl font-bold text-primary mb-2">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-muted-foreground mb-4">{user.email}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                        <Badge>{user.bloodType}</Badge>
                        <Badge variant="outline">{user.weight} kg</Badge>
                      </div>

                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {/* Datos básicos */}
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Nombre"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <Input
                          placeholder="Apellido"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>

                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          value={formData.bloodType}
                          onValueChange={(v) => setFormData({ ...formData, bloodType: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="Tipo de Sangre" /></SelectTrigger>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          type="number"
                          placeholder="Peso (kg)"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                      </div>

                      {/* Datos de salud del onboarding */}
                      <div className="space-y-2">
                        <Label>¿Has donado antes?</Label>
                        <Select
                          value={formData.donatedBefore}
                          onValueChange={(v) => setFormData({ ...formData, donatedBefore: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sí">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>

                        <Label>¿Tienes tatuajes o piercings?</Label>
                        <Select
                          value={formData.tattoosPiercings}
                          onValueChange={(v) => setFormData({ ...formData, tattoosPiercings: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sí">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>

                        {formData.tattoosPiercings === "sí" && (
                          <div className="mt-2">
                            <Label>Fecha del último tatuaje/piercing</Label>
                            <Input
                              type="date"
                              value={formData.tattooDate}
                              onChange={(e) => setFormData({ ...formData, tattooDate: e.target.value })}
                            />
                            {!canDonateAgain && (
                              <p className="text-red-500 text-sm mt-1">
                                No podés donar aún. Han pasado solo {tattooDaysAgo} días.
                              </p>
                            )}
                          </div>
                        )}

                        <Label>¿Tomas algún medicamento?</Label>
                        <Input
                          placeholder="Especifica (si aplica)"
                          value={formData.medications}
                          onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleUpdateProfile} className="flex-1">
                          Guardar Cambios
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card><CardHeader><CardTitle>Donaciones</CardTitle></CardHeader><CardContent>{donationCount}</CardContent></Card>
            <Card><CardHeader><CardTitle>Última donación</CardTitle></CardHeader><CardContent>{lastDonationDate}</CardContent></Card>
            <Card><CardHeader><CardTitle>Vidas salvadas</CardTitle></CardHeader><CardContent>{livesSaved}</CardContent></Card>
          </div>

          {/* Logout */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
