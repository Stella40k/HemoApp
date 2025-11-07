/**
 * OnboardingPage.jsx - PÁGINA DE RELLENO TEMPORAL
 *
 * Propósito: Proveer una exportación válida para que App.jsx no se caiga.
 * Una vez que esto funcione, la redirección al Dashboard será visible.
 */
import Header from "../components/Header";

export default function OnboardingPage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Cargando Onboarding...
        </h1>
        <p className="text-lg text-gray-700">
          Esta página de Onboarding está en desarrollo. Presiona "Inicio" para ir al Dashboard.
        </p>
      </main>
    </div>
  );
}