import React, { useEffect, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Helper: attempt to get ISO A3 code from common property keys
function getIsoA3(props) {
  return (
    props.ISO_A3 ||
    props.ISO_A3_EH ||
    props.ISO_A3 || // double-check key variants
    props.ADM0_A3 ||
    props.iso_a3 ||
    props.ISO_A3 ||
    props["ISO_A3"] ||
    props["iso_a3"] ||
    props["adm0_a3"] ||
    props["ADM0_A3"]
  );
}

// Helper: get a human-friendly country name from properties
function getCountryName(props) {
  return (
    props.NAME ||
    props.name ||
    props.ADMIN ||
    props.ADMIN_NAME ||
    props.NAME_LONG ||
    props.name_long ||
    props.admin ||
    props.country ||
    "Unknown"
  );
}

export default function WorldMap() {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  // tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    languages: null, // null = not fetched, [] = fetched but none, array = list
    loading: false,
    error: null,
  });

  // simple in-memory cache for country languages keyed by iso3 or name
  const langCacheRef = useRef({});

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

  // fetch languages using REST Countries API
  // prefer alpha (ISO A3) lookup, fallback to name lookup
  async function fetchLanguages({ iso3, name }) {
    const cacheKey = iso3 || name.toLowerCase();
    if (langCacheRef.current[cacheKey]) {
      return langCacheRef.current[cacheKey];
    }

    const endpointsTried = [];
    // try alpha3 (cca3)
    if (iso3) {
      try {
        endpointsTried.push(`alpha/${iso3}`);
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${iso3}`);
        if (!res.ok) throw new Error(`alpha/${iso3} returned ${res.status}`);
        const data = await res.json();
        // API returns an array for alpha lookup
        const country = Array.isArray(data) ? data[0] : data;
        const langs = country?.languages
          ? Object.values(country.languages)
          : [];
        langCacheRef.current[cacheKey] = {
          name: country?.name?.common || name,
          languages: langs,
        };
        return langCacheRef.current[cacheKey];
      } catch (errAlpha) {
        // swallow and fallback
        console.warn("alpha lookup failed:", errAlpha);
      }
    }

    // fallback: search by name (best-effort, may return multiple; use first)
    try {
      endpointsTried.push(`name/${encodeURIComponent(name)}`);
      const res2 = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          name
        )}?fullText=true`
      );
      if (res2.ok) {
        const data2 = await res2.json();
        const country = Array.isArray(data2) ? data2[0] : data2;
        const langs = country?.languages
          ? Object.values(country.languages)
          : [];
        langCacheRef.current[cacheKey] = {
          name: country?.name?.common || name,
          languages: langs,
        };
        return langCacheRef.current[cacheKey];
      } else {
        // last resort: try name search without fullText
        const res3 = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`
        );
        if (res3.ok) {
          const data3 = await res3.json();
          const country = Array.isArray(data3) ? data3[0] : data3;
          const langs = country?.languages
            ? Object.values(country.languages)
            : [];
          langCacheRef.current[cacheKey] = {
            name: country?.name?.common || name,
            languages: langs,
          };
          return langCacheRef.current[cacheKey];
        }
      }
    } catch (errName) {
      console.warn("name lookup failed:", errName);
    }

    // If everything fails, cache empty result
    langCacheRef.current[cacheKey] = { name, languages: [] };
    return langCacheRef.current[cacheKey];
  }

  // handler when hovering a country
  async function handleGeoHover(event, geo) {
    const props = geo.properties || {};
    const name = getCountryName(props);
    const iso3 =
      geo.id ||
      getIsoA3(props) ||
      (props.iso_a3 && props.iso_a3 !== "-99" ? props.iso_a3 : null) ||
      null;

    // set tooltip visible & position & loading state
    setTooltip((t) => ({
      ...t,
      visible: true,
      x: event.clientX,
      y: event.clientY,
      name,
      loading: true,
      error: null,
      languages: null,
    }));

    try {
      const result = await fetchLanguages({ iso3, name });
      setTooltip((t) => ({
        ...t,
        loading: false,
        languages: result.languages,
        name: result.name || name,
      }));
    } catch (err) {
      setTooltip((t) => ({
        ...t,
        loading: false,
        error: err.message || "Failed to fetch languages",
      }));
    }
  }

  // update tooltip position while moving
  function handleGeoMove(event) {
    setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY }));
  }

  function handleGeoLeave() {
    setTooltip((t) => ({ ...t, visible: false, loading: false, error: null }));
  }

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
        Explore World Languages
      </h1>

      <div
        className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700/40 max-w-6xl w-full"
        style={{ overflow: "visible" }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 10] }}
          width={980}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <defs>
            <filter
              id="glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="6"
                result="blur"
              />
              <feFlood
                floodColor="#60a5fa"
                floodOpacity="0.85"
                result="flood"
              />
              <feComposite
                in="flood"
                in2="blur"
                operator="in"
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-strong"
              x="-75%"
              y="-75%"
              width="250%"
              height="250%"
              filterUnits="objectBoundingBox"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur2"
              />
              <feFlood
                floodColor="#60a5fa"
                floodOpacity="0.9"
                result="flood2"
              />
              <feComposite
                in="flood2"
                in2="blur2"
                operator="in"
                result="coloredBlur2"
              />
              <feMerge>
                <feMergeNode in="coloredBlur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => handleGeoHover(e, geo)}
                  onMouseMove={handleGeoMove}
                  onMouseLeave={handleGeoLeave}
                  style={{
                    default: {
                      fill: "#0f172a",
                      stroke: "#1e3a8a",
                      strokeWidth: 0.5,
                      outline: "none",
                      transition:
                        "filter 220ms ease-in-out, stroke 180ms ease-in-out",
                      vectorEffect: "non-scaling-stroke",
                    },
                    hover: {
                      fill: "#0f172a",
                      stroke: "#60a5fa",
                      strokeWidth: 0.9,
                      outline: "none",
                      cursor: "pointer",
                      filter: "url(#glow)",
                    },
                    pressed: {
                      fill: "#0b1220",
                      outline: "none",
                      filter: "url(#glow-strong)",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="pointer-events-none fixed z-50 max-w-xs rounded-lg p-3 text-sm bg-[#0b1220] border border-[#1b263b] shadow-lg"
            style={{
              left: tooltip.x + 12,
              top: Math.min(window.innerHeight - 80, tooltip.y + 12),
              transform: "translateZ(0)",
            }}
          >
            <div className="font-semibold text-white mb-1">{tooltip.name}</div>

            {tooltip.loading ? (
              <div className="text-gray-400">Loading languages…</div>
            ) : tooltip.error ? (
              <div className="text-red-400">Error: {tooltip.error}</div>
            ) : tooltip.languages && tooltip.languages.length > 0 ? (
              <div>
                <div className="text-gray-300 text-xs mb-1">Languages:</div>
                <div className="text-gray-100">
                  {tooltip.languages.join(", ")}
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Languages not available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
