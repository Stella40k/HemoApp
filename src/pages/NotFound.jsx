import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">Página no encontrada</p>
        <Link to="/" className="mt-6 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md">Volver al inicio</Link>
      </div>
    </div>
  );
}
