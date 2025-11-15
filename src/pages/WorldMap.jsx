import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function WorldMap() {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(geoUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        return res.json();
      })
      .then((topo) => {
        if (!mounted) return;
        setGeoData(topo);
      })
      .catch((err) => {
        console.error("Error loading geography:", err);
        if (mounted) setError(err.message);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-red-400">Failed to load map: {error}</div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-300">Loading map…</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center px-4 py-10 text-white">
      <h1 className="text-4xl font-bold text-blue-400 mb-6 tracking-wide">
        World Map Display
      </h1>

      {/* Allow overflow visible so drop-shadow isn't clipped */}
      <div
        className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700/40 max-w-6xl w-full"
        style={{ overflow: "visible" }}
      >
        {/* ComposableMap set to be responsive. Reduce scale & center so whole world fits */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 10] }}
          width={980}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  // No transform on hover — only a drop shadow
                  style={{
                    default: {
                      fill: "#0f172a",
                      stroke: "#1e3a8a",
                      strokeWidth: 0.5,
                      outline: "none",
                      transition:
                        "filter 180ms ease-in-out, stroke 180ms ease-in-out",
                      // ensure pointer events work on small shapes
                      vectorEffect: "non-scaling-stroke",
                    },
                    hover: {
                      fill: "#0f172a", // keep fill same or change slightly if you want color change
                      stroke: "#60a5fa",
                      strokeWidth: 0.8,
                      outline: "none",
                      cursor: "pointer",
                      // Only shadow — no scale, no transform
                      filter: "drop-shadow(0 6px 10px rgba(59,130,246,0.35))",
                    },
                    pressed: {
                      fill: "#0b1220",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
