import React from 'react';
import {
  CircleDot,
  Split,
  LightbulbOff,
  Trash2,
  Signpost,
  Droplet,
  Layers
} from 'lucide-react';

export default function DefectIcon({ type, className = 'w-5 h-5' }) {
  const normType = type?.toLowerCase() || '';

  if (normType.includes('pothole')) {
    return <CircleDot className={`${className} text-rose-400`} />;
  }
  if (normType.includes('crack') || normType.includes('road')) {
    return <Split className={`${className} text-amber-400`} />;
  }
  if (normType.includes('light') || normType.includes('lamp') || normType.includes('street')) {
    return <LightbulbOff className={`${className} text-blue-400`} />;
  }
  if (normType.includes('garbage') || normType.includes('trash') || normType.includes('waste')) {
    return <Trash2 className={`${className} text-emerald-400`} />;
  }
  if (normType.includes('sign') || normType.includes('traffic') || normType.includes('signal')) {
    return <Signpost className={`${className} text-purple-400`} />;
  }
  if (normType.includes('water') || normType.includes('leak') || normType.includes('pipe')) {
    return <Droplet className={`${className} text-cyan-400`} />;
  }

  return <Layers className={`${className} text-slate-400`} />;
}
