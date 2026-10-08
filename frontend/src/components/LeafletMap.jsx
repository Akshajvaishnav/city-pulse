import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import DefectIcon from './DefectIcon';
import { ExternalLink, MapPin } from 'lucide-react';
import { useIssues } from '../context/IssueContext';

// Fix for default Leaflet icon assets in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin generator
function createCustomPin(severity, status) {
  let color = '#10B981'; // green / low
  let glow = 'rgba(16, 185, 129, 0.4)';
  if (severity === 'High') {
    color = '#EF4444'; // red
    glow = 'rgba(239, 68, 68, 0.6)';
  } else if (severity === 'Medium') {
    color = '#F59E0B'; // amber
    glow = 'rgba(245, 158, 11, 0.5)';
  }

  const isHigh = severity === 'High' && status !== 'Resolved';

  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      ${isHigh ? `<div class="pulse-marker" style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${glow};"></div>` : ''}
      <div style="
        width: 24px; 
        height: 24px; 
        background: ${color}; 
        border: 2px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 12px ${color}; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        z-index: 2;
      ">
        <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function MapController({ issues, center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.2 });
    } else if (issues && issues.length > 0) {
      const bounds = L.latLngBounds(issues.map((i) => [i.latitude, i.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [issues, center, map]);
  return null;
}

export default function LeafletMap({ issues = [], height = '500px', center = null, zoom = 12 }) {
  const { setSelectedIssueId } = useIssues();
  const defaultPosition = [28.6139, 77.2090]; // Delhi Smart City Central coordinates

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
      <MapContainer
        center={center || defaultPosition}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController issues={issues} center={center} />

        {issues.map((issue) => (
          <Marker
            key={issue.id || issue.report_id}
            position={[issue.latitude, issue.longitude]}
            icon={createCustomPin(issue.severity, issue.status)}
          >
            <Popup>
              <div className="w-64 p-3 bg-slate-900 text-slate-100 rounded-xl overflow-hidden font-sans">
                {issue.image_url && (
                  <div className="h-28 w-full bg-slate-950 rounded-lg overflow-hidden mb-2 relative border border-slate-800">
                    <img
                      src={issue.image_url}
                      alt={issue.defect_type}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <SeverityBadge severity={issue.severity} size="sm" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {issue.report_id}
                  </span>
                  <StatusBadge status={issue.status} size="sm" />
                </div>

                <div className="flex items-center gap-1.5 text-sm font-bold text-white mb-1">
                  <DefectIcon type={issue.defect_type} className="w-4 h-4" />
                  <span>{issue.defect_type}</span>
                </div>

                <div className="flex items-start gap-1 text-xs text-slate-400 mb-3 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{issue.location_name}</span>
                </div>

                <button
                  onClick={() => setSelectedIssueId(issue.id)}
                  className="w-full py-1.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>View Full Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
