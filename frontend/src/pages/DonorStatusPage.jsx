import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';
import PropTypes from 'prop-types';

export default function DonorStatusPage({ user, onLogout, onUpdateUser }) {
  // Use user's donations if present to compute impact, otherwise fallback
  const donationCount = (user?.donations || []).length || user?.donationCount || 0;
  const peopleHelped = donationCount * 3;

  const [status, setStatus] = useState(user?.status || 'donante');

  const saveStatus = (newStatus) => {
    setStatus(newStatus);
    const updatedUser = { ...user, status: newStatus };
    onUpdateUser && onUpdateUser(updatedUser);
    localStorage.setItem('hemoapp_user', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('hemoapp_users') || '[]');
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      localStorage.setItem('hemoapp_users', JSON.stringify(users));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Estado como Donador</h1>
          <p className="text-muted-foreground mb-8">Actualizá tu estado y mirá el impacto estimado</p>

          {/* Main Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  Estado actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select
                    className="w-full rounded-md border p-2"
                    value={status}
                    onChange={(e) => saveStatus(e.target.value)}
                  >
                    <option value="donante">Donante</option>
                    <option value="paciente">Paciente</option>
                    <option value="no_puede_donar">No puede donar</option>
                    <option value="otro">Otro</option>
                  </select>
                  <p className="text-sm text-muted-foreground">Cambiá tu estado para que las instituciones sepan tu disponibilidad</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  Tu Impacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Personas ayudadas</span>
                    <span className="text-sm font-medium">{peopleHelped} / 30</span>
                  </div>
                  <Progress value={(peopleHelped / 30) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Última donación y el historial están disponibles en tu perfil.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

DonorStatusPage.propTypes = {
  user: PropTypes.any,
  onLogout: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func,
};