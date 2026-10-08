import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

const pickerIcon = L.divIcon({
  className: 'location-picker-marker',
  html: `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 24px; height: 24px; background: #06b6d4; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 15px #06b6d4; display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, { duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerMap({ latitude, longitude, onLocationChange, onLocationNameChange }) {
  const [currentLat, setCurrentLat] = useState(latitude || 28.6280);
  const [currentLng, setCurrentLng] = useState(longitude || 77.3649);

  const presets = [
    { name: 'Sector 62, Expressway', lat: 28.6280, lng: 77.3649 },
    { name: 'Sector 18, Commercial Hub', lat: 28.5708, lng: 77.3260 },
    { name: 'Connaught Place, Central', lat: 28.6315, lng: 77.2167 },
    { name: 'Sector 15, North Zone', lat: 28.7180, lng: 77.1350 },
    { name: 'Cyber Hub, Tech District', lat: 28.4986, lng: 77.0878 },
  ];

  const handleSelect = (lat, lng, name = null) => {
    const rLat = parseFloat(lat.toFixed(6));
    const rLng = parseFloat(lng.toFixed(6));
    setCurrentLat(rLat);
    setCurrentLng(rLng);
    onLocationChange(rLat, rLng);

    if (name) {
      onLocationNameChange(name);
    } else {
      // Approximate sector label
      onLocationNameChange(`Geotagged Sector Point (${rLat.toFixed(4)}, ${rLng.toFixed(4)})`);
    }
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleSelect(pos.coords.latitude, pos.coords.longitude, 'Live Device GPS Geolocation');
        },
        () => {
          // Fallback to demo coordinate
          handleSelect(28.6139, 77.2090, 'Central Command Sector');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Interactive Location Selector (Click anywhere on map to pin)</span>
        </label>
        <button
          type="button"
          onClick={handleUseGPS}
          className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Use My GPS</span>
        </button>
      </div>

      <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler onLocationSelect={(lat, lng) => handleSelect(lat, lng)} />
          <RecenterMap lat={currentLat} lng={currentLng} />
          <Marker position={[currentLat, currentLng]} icon={pickerIcon} />
        </MapContainer>

        <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300 border border-slate-700 pointer-events-none z-10">
          Lat: {currentLat.toFixed(4)} | Lng: {currentLng.toFixed(4)}
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Quick City Hotspot Presets:</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleSelect(p.lat, p.lng, p.name)}
              className="text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-md border border-slate-800 hover:border-cyan-500/40 transition"
            >
              {p.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
