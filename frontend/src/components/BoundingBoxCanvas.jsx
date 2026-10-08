import React, { useState } from 'react';

export default function BoundingBoxCanvas({ imageUrl, boundingBoxes = [], alt = "Detection preview" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative w-full h-full min-h-[320px] bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none group">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-contain max-h-[500px]"
      />

      {/* SVG overlay for dynamic bounding boxes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {boundingBoxes.map((boxDef, index) => {
          // Box is [ymin, xmin, ymax, xmax] normalized 0 to 1
          const [ymin, xmin, ymax, xmax] = boxDef.box || [0, 0, 0, 0];
          const top = `${ymin * 100}%`;
          const left = `${xmin * 100}%`;
          const width = `${(xmax - xmin) * 100}%`;
          const height = `${(ymax - ymin) * 100}%`;
          const color = boxDef.color || '#38bdf8';
          const isHovered = hoveredIndex === index;

          return (
            <g key={index}>
              {/* Bounding box rectangle */}
              <rect
                x={left}
                y={top}
                width={width}
                height={height}
                fill={isHovered ? `${color}33` : `${color}15`}
                stroke={color}
                strokeWidth={isHovered ? "3" : "2"}
                strokeDasharray={isHovered ? "none" : "6,3"}
                className="transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Label Tags */}
      {boundingBoxes.map((boxDef, index) => {
        const [ymin, xmin] = boxDef.box || [0, 0];
        const top = `${Math.max(2, ymin * 100 - 4)}%`;
        const left = `${Math.max(2, xmin * 100)}%`;
        const color = boxDef.color || '#38bdf8';
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={`tag-${index}`}
            style={{ top, left }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`absolute z-20 cursor-pointer text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg transition-transform duration-200 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{
              top,
              left,
              backgroundColor: color,
              color: '#ffffff',
            }}
          >
            {boxDef.label} • {Math.round((boxDef.confidence || 0.9) * 100)}%
          </div>
        );
      })}

      {boundingBoxes.length === 0 && (
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-400 border border-slate-700">
          Raw CCTV / Citizen Capture
        </div>
      )}
    </div>
  );
}
