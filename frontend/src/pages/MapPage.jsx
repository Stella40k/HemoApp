/**
 * MapPage.jsx - Página de mapa interactivo de centros de donación
 * * Versión 100% Visual y Funcional en Frontend (Usando Datos Estáticos Simulados).
 * - ICONO ACTUALIZADO: SVG de Cruz Roja sin fondo, color #E5203A.
 */

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import { Compass } from "lucide-react"; 

// ----------------------------------------------------
// A. FÓRMULA DE HAVERSINE (CÁLCULO DE DISTANCIA)
// ----------------------------------------------------

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d; // Distancia en km
}


// ----------------------------------------------------
// B. CORRECCIÓN DE ÍCONOS Y DEFINICIÓN DE ÍCONOS PERSONALIZADOS
// ----------------------------------------------------

// Corrección de rutas de iconos para Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

// 🚨 COLOR DE ACENTO ROJO BRILLANTE: #E5203A
const ACCENT_RED_BRIGHT = '#E5203A'; 

// Ícono base para Hospitales y Centros de Donación (SVG directo sin fondo)
const customHospitalIcon = L.divIcon({
  className: 'custom-hospital-icon-no-bg', // Nueva clase sin estilos predeterminados
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${ACCENT_RED_BRIGHT}" class="size-6">
        <path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clip-rule="evenodd" />
    </svg>`,
  iconSize: [32, 32], // Tamaño del SVG
  iconAnchor: [16, 16] // Punto de anclaje centrado para un ícono sin base
});

// Ícono especial para el centro más cercano (Mantiene la estrella dorada para contraste)
const nearestCenterIcon = L.divIcon({
  className: 'nearest-center-icon',
  html: `
    <div style="background-color: gold; border-radius: 50%; padding: 6px; box-shadow: 0 0 15px rgba(255,165,0,0.8); transform: translate(-50%, -50%); border: 3px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});


// ----------------------------------------------------
// C. DATOS ESTÁTICOS SIMULADOS (Con Dirección, Horario y Estado)
// ----------------------------------------------------

const centers = [
    {
        id: 1,
        name: "Hospital Central de Formosa",
        coords: [-26.1841, -58.1781],
        address: "Av. 25 de Mayo 1445, P3600",
        schedule: "Lunes a Viernes: 8:00 - 12:00",
        status: "Abierto",
    },
    {
        id: 2,
        name: "Hospital de Alta Complejidad (HAC)",
        coords: [-26.186, -58.17],
        address: "Av. Pantaleón Gómez 1700, P3600",
        schedule: "Lunes a Sábado: 7:30 - 11:30",
        status: "Cerrado", 
    },
    {
        id: 3,
        name: "Hospital Distrital 8",
        coords: [-26.1935, -58.1653],
        address: "Av. Maradona y Av. Pueyrredón, P3600",
        schedule: "Miércoles y Viernes: 8:00 - 11:00",
        status: "Abierto",
    },
    {
        id: 4,
        name: "Centro Provincial de Hemoterapia",
        coords: [-26.19, -58.182],
        address: "Mitre 240, P3600",
        schedule: "Lunes a Sábado: 7:00 - 18:00",
        status: "Abierto",
    },
    {
        id: 5,
        name: "Hospital de la Madre y el Niño",
        coords: [-26.1812, -58.1745],
        address: "Av. 25 de Mayo 1445 (Anexo), P3600",
        schedule: "Solo con turno",
        status: "Cerrado",
    },
    {
        id: 6,
        name: "Campaña Móvil (Plaza Central)",
        coords: [-26.177, -58.175],
        address: "Plaza San Martín, Centro",
        schedule: "Campaña del 10/11 al 12/11",
        status: "Abierto",
        isCampaign: true 
    },
];


// ----------------------------------------------------
// D. COMPONENTES HELPER (LOCATE Y FITBOUNDS)
// ----------------------------------------------------

function FitBoundsToMarkers({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;
    const latlngs = markers.map((m) => m.coords);
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
      const { latlng, accuracy } = e; 
      onLocated([latlng.lat, latlng.lng, accuracy]);
    }
    map.on("locationfound", onLocationFound);
    return () => {
      map.off("locationfound", onLocationFound);
    };
  }, [map, onLocated]);

  return (
    <div className="leaflet-bottom leaflet-right" style={{ padding: 10 }}>
      <button
        onClick={handleLocate}
        className="flex items-center bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        title="Encontrar mi ubicación y centrar mapa"
      >
        <Compass className="w-4 h-4 mr-2" /> 📍 Mi Ubicación
      </button>
    </div>
  );
}


// ----------------------------------------------------
// E. COMPONENTE PRINCIPAL (CON LÓGICA DEL MÁS CERCANO)
// ----------------------------------------------------

export default function MapPage({ user, onLogout }) {
  const [userPos, setUserPos] = useState(null); 
  const [nearestCenter, setNearestCenter] = useState(null); 
  const mapRef = useRef();

  const center = [-26.1841, -58.1781]; 

  useEffect(() => {
    if (!userPos || centers.length === 0) {
      setNearestCenter(null);
      return;
    }

    let closest = null;
    let minDistance = Infinity;
    const [userLat, userLng] = userPos;

    centers.forEach(center => {
      const [centerLat, centerLng] = center.coords;
      const distance = getDistanceFromLatLonInKm(userLat, userLng, centerLat, centerLng);

      if (distance < minDistance) {
        minDistance = distance;
        closest = { ...center, distance: distance }; 
      }
    });

    setNearestCenter(closest);

  }, [userPos]);


  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      <div className="container mx-auto py-8 px-6">
        <div className="w-full h-[500px] rounded-md shadow overflow-hidden">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcadores de Centros de Donación y Campañas */}
            {centers.map((c) => { 
                const isNearest = nearestCenter && nearestCenter.id === c.id;
                const iconToUse = isNearest ? nearestCenterIcon : customHospitalIcon;
                
                const statusColorClass = c.status === 'Abierto' ? 'text-green-600' : 'text-red-600';
                const statusIcon = c.status === 'Abierto' ? '🟢' : '🔴';

                return (
                    <Marker key={c.id} position={c.coords} icon={iconToUse}>
                        
                        <Tooltip direction="top" permanent={false} offset={[0, -20]}>
                            {c.name} 
                            {isNearest && ' ⭐ (MÁS CERCANO)'} 
                        </Tooltip>

                        <Popup>
                            <div className="p-2 space-y-2">
                                <strong className="block text-lg mb-1">{c.name}</strong>
                                
                                {c.isCampaign && <p className="text-sm font-semibold text-orange-600">🩸 Campaña Móvil</p>}
                                
                                <p className="text-sm text-gray-700">
                                    📍 Dirección: {c.address}
                                </p>
                                
                                <p className="text-sm text-gray-700">
                                    ⏰ Horario: {c.schedule}
                                </p>
                                
                                <p className={`text-base font-bold ${statusColorClass}`}>
                                    {statusIcon} {c.status}
                                </p>

                                {isNearest && nearestCenter.distance && (
                                    <p className="text-sm font-semibold text-blue-700 mt-2">
                                        Distancia: {nearestCenter.distance.toFixed(2)} km
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            {/* Ubicación del Usuario en Tiempo Real (Círculo de Precisión Azul) */}
            {userPos && (
              <>
                <Circle
                  center={[userPos[0], userPos[1]]}
                  radius={userPos[2] || 5000} 
                  pathOptions={{ color: "var(--accent)", opacity: 0.3, weight: 1 }}
                />
                <Marker position={[userPos[0], userPos[1]]}>
                  <Popup>
                    <strong className="text-primary">Tu Ubicación Actual</strong>
                    <br />
                    Precisión estimada: **{(userPos[2] / 1000).toFixed(1)} km**
                  </Popup>
                </Marker>
              </>
            )}

            <FitBoundsToMarkers markers={centers} />
            <LocateButton onLocated={(pos) => setUserPos(pos)} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}