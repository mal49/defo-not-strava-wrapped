import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Flame } from 'lucide-react';
import { useMemo, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface HeatmapSlideProps {
  polylines: string[];
}

// Extend Leaflet types for heat layer
declare module 'leaflet' {
  function heatLayer(
    latlngs: [number, number, number?][],
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: Record<number, string>;
    }
  ): L.Layer;
}

// Component to render heatmap
function HeatmapLayer({ points }: { points: [number, number][] }) {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (points.length === 0) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create heat points with intensity
    const heatPoints: [number, number, number][] = points.map(p => [p[0], p[1], 0.5]);

    // Create heat layer with Strava-like orange gradient
    const heat = L.heatLayer(heatPoints, {
      radius: 15,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: {
        0.0: '#000000',
        0.2: '#4a1c00',
        0.4: '#8b3500',
        0.6: '#fc4c02',
        0.8: '#ff8c42',
        1.0: '#ffdd00',
      },
    });

    heat.addTo(map);
    heatLayerRef.current = heat;

    // Fit bounds to all points
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p[0], p[1]] as [number, number]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points]);

  return null;
}

export function HeatmapSlide({ polylines }: HeatmapSlideProps) {
  const [mapReady, setMapReady] = useState(false);

  // Decode all polylines and collect all points
  const allPoints = useMemo(() => {
    const points: [number, number][] = [];
    
    polylines.forEach(encodedPolyline => {
      try {
        const decoded = polyline.decode(encodedPolyline) as [number, number][];
        // Sample points to avoid too many (take every 3rd point)
        for (let i = 0; i < decoded.length; i += 3) {
          points.push(decoded[i]);
        }
      } catch {
        // Skip invalid polylines
      }
    });
    
    return points;
  }, [polylines]);

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (allPoints.length > 0) {
      const avgLat = allPoints.reduce((sum, p) => sum + p[0], 0) / allPoints.length;
      const avgLng = allPoints.reduce((sum, p) => sum + p[1], 0) / allPoints.length;
      return [avgLat, avgLng] as [number, number];
    }
    return [0, 0] as [number, number];
  }, [allPoints]);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (polylines.length === 0) {
    return null;
  }

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="relative z-10 text-center w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-3"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/20 backdrop-blur-sm">
            <Flame className="w-7 h-7 text-orange-500" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-sm mb-1 uppercase tracking-wider"
        >
          Your Running Heatmap
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white text-lg font-semibold mb-4"
        >
          Where you run the most
        </motion.h2>

        {/* Heatmap */}
        {mapReady && allPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl overflow-hidden border border-orange-500/30 shadow-2xl shadow-orange-500/20"
            style={{ height: '320px' }}
          >
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              attributionControl={false}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <HeatmapLayer points={allPoints} />
            </MapContainer>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <span className="text-white/50 text-xs">Less</span>
          <div 
            className="h-2 w-32 rounded-full"
            style={{
              background: 'linear-gradient(to right, #4a1c00, #8b3500, #fc4c02, #ff8c42, #ffdd00)',
            }}
          />
          <span className="text-white/50 text-xs">More</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/40 text-xs mt-3"
        >
          Brighter areas = more frequent runs
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

