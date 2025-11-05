import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bloodType: '',
    weight: '',
    status: '',
    donations: [],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      profileImage: null,
      donationCount: (formData.donations || []).length,
      lastDonation: (formData.donations && formData.donations.length > 0) ? formData.donations[formData.donations.length -1].date : null,
      badges: [],
    };

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('hemoapp_users') || '[]');
    users.push(newUser);
    localStorage.setItem('hemoapp_users', JSON.stringify(users));
    
    onRegister(newUser);
    toast({
      title: "¡Registro exitoso!",
      description: "Bienvenido a HemoApp",
    });
    navigate('/dashboard');
  };

  // Donation form state (for optional previous donations)
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationEntry, setDonationEntry] = useState({ date: '', hospital: '', units: 1, bloodType: formData.bloodType });

  const addDonationToForm = () => {
    if (!donationEntry.date || !donationEntry.hospital) return;
    const updated = { ...formData, donations: [...(formData.donations || []), donationEntry] };
    setFormData(updated);
    setDonationEntry({ date: '', hospital: '', units: 1, bloodType: formData.bloodType });
    setShowDonationForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Crear Cuenta</CardTitle>
          <CardDescription>Únete a la comunidad de donantes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Select value={formData.bloodType} onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
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
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donante">Donante</SelectItem>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="no_puede_donar">No puede donar</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Optional: add past donations */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Donaciones previas (opcional)</h4>
                <Button variant="outline" size="sm" onClick={() => setShowDonationForm(!showDonationForm)}>
                  {showDonationForm ? 'Cancelar' : 'Agregar donación'}
                </Button>
              </div>

              {showDonationForm && (
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <Input
                    type="date"
                    value={donationEntry.date}
                    onChange={(e) => setDonationEntry({ ...donationEntry, date: e.target.value })}
                  />
                  <Input
                    placeholder="Hospital"
                    value={donationEntry.hospital}
                    onChange={(e) => setDonationEntry({ ...donationEntry, hospital: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={1}
                    value={donationEntry.units}
                    onChange={(e) => setDonationEntry({ ...donationEntry, units: Number(e.target.value) })}
                  />
                  <Select value={donationEntry.bloodType || formData.bloodType} onValueChange={(v) => setDonationEntry({ ...donationEntry, bloodType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de sangre" />
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
                  <div className="pt-2">
                    <Button onClick={addDonationToForm}>Agregar</Button>
                  </div>
                </div>
              )}

              {formData.donations && formData.donations.length > 0 && (
                <div className="space-y-2">
                  {formData.donations.map((d, idx) => (
                    <div key={idx} className="p-2 rounded bg-card">
                      <div className="text-sm font-medium">{d.date} - {d.hospital}</div>
                      <div className="text-xs text-muted-foreground">{d.units} unidades • {d.bloodType}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
              Crear Cuenta
            </Button>
            <div className="text-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-sm text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
