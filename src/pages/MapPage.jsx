import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '@/components/Header';

// Fix default icon paths for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const hospitals = [
  { id: 1, name: 'Hospital Central de Formosa', coords: [-26.1841, -58.1781], type: 'Hospital General' },
  { id: 2, name: 'Hospital de Alta Complejidad (HAC)', coords: [-26.1860, -58.1700], type: 'Hospital Especializado' },
  { id: 3, name: 'Hospital Distrital 8', coords: [-26.1935, -58.1653], type: 'Hospital Distrital' },
  { id: 4, name: 'Centro Provincial de Hemoterapia', coords: [-26.1900, -58.1820], type: 'Centro de Sangre' },
  { id: 5, name: 'Hospital de la Madre y el Niño', coords: [-26.1812, -58.1745], type: 'Hospital Materno-Infantil' },
  { id: 6, name: 'Hospital Odontológico de Complejidad Integrada', coords: [-26.1855, -58.1734], type: 'Hospital Especializado' },
];

function FitBoundsToMarkers({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;
    const latlngs = markers.map(m => m.coords);
    map.fitBounds(latlngs, { padding: [50, 50] });
  }, [map, markers]);
  return null;
}

function LocateButton({ onLocated }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 14 });
  };

  useEffect(() => {
    function onLocationFound(e) {
      const { latlng } = e;
      onLocated([latlng.lat, latlng.lng]);
    }
    map.on('locationfound', onLocationFound);
    return () => {
      map.off('locationfound', onLocationFound);
    };
  }, [map, onLocated]);

  return (
    <div className="leaflet-bottom leaflet-right" style={{ padding: 10 }}>
      <button
        onClick={handleLocate}
        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        title="Encontrar mi ubicación"
      >
        📍 Mi Ubicación
      </button>
    </div>
  );
}

export default function MapPage({ user, onLogout }) {
  const [userPos, setUserPos] = useState(null);
  const mapRef = useRef();

  // Center roughly on Formosa province (city) initially
  const center = [-26.1841, -58.1781];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      <div className="container mx-auto py-8 px-6">
        <div className="w-full h-[700px] rounded-md shadow overflow-hidden">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hospitals.map(h => (
              <Marker key={h.id} position={h.coords}>
                <Popup>
                  <div className="p-2">
                    <strong className="block text-lg mb-1">{h.name}</strong>
                    <span className="text-sm text-gray-600">{h.type}</span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {userPos && (
              <>
                <Marker position={userPos}>
                  <Popup>Tu ubicación</Popup>
                </Marker>
                <Circle center={userPos} radius={5000} pathOptions={{ color: 'var(--accent)', opacity: 0.2 }} />
              </>
            )}

            <FitBoundsToMarkers markers={hospitals} />
            <LocateButton onLocated={(pos) => setUserPos(pos)} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
