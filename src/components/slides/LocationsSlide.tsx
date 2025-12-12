import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { MapPin } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import type { RouteData } from '../../types/strava';
import { ROUTE_COLORS } from '../../constants';
import 'leaflet/dist/leaflet.css';

interface LocationsSlideProps {
  routes: RouteData[];
}

// Component to fit map bounds to the first (longest) route
function FitBounds({ decodedRoutes }: { decodedRoutes: [number, number][][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (decodedRoutes.length > 0 && decodedRoutes[0].length > 0) {
      // Zoom to the first (longest) route only
      map.fitBounds(decodedRoutes[0], { padding: [30, 30] });
    }
  }, [decodedRoutes, map]);
  
  return null;
}

export function LocationsSlide({ routes }: LocationsSlideProps) {
  const [mapReady, setMapReady] = useState(false);

  // Decode all polylines
  const decodedRoutes = useMemo(() => {
    return routes.map(route => {
      try {
        return polyline.decode(route.polyline) as [number, number][];
      } catch {
        return [];
      }
    }).filter(r => r.length > 0);
  }, [routes]);

  // Calculate map center from all routes
  const mapCenter = useMemo(() => {
    if (decodedRoutes.length > 0) {
      const allPoints = decodedRoutes.flat();
      if (allPoints.length > 0) {
        const avgLat = allPoints.reduce((sum, p) => sum + p[0], 0) / allPoints.length;
        const avgLng = allPoints.reduce((sum, p) => sum + p[1], 0) / allPoints.length;
        return [avgLat, avgLng] as [number, number];
      }
    }
    return [0, 0] as [number, number];
  }, [decodedRoutes]);

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="relative z-10 text-center w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-2"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-orange-500" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-sm mb-1 uppercase tracking-wider"
        >
          Route of the Year
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-white text-xl font-bold mb-1"
        >
          {routes[0]?.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-orange-400 text-lg font-semibold mb-3"
        >
          {routes[0]?.distance.toFixed(1)} km
        </motion.p>

        {/* Map with Routes */}
        {decodedRoutes.length > 0 && mapReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4 rounded-2xl overflow-hidden border border-orange-500/30 shadow-lg"
            style={{ height: '220px' }}
          >
            <MapContainer
              center={mapCenter}
              zoom={12}
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
              <FitBounds decodedRoutes={decodedRoutes} />
              {decodedRoutes.map((route, i) => (
                <Polyline
                  key={i}
                  positions={route}
                  pathOptions={{
                    color: ROUTE_COLORS[i % ROUTE_COLORS.length],
                    weight: i === 0 ? 4 : 3,
                    opacity: i === 0 ? 1 : 0.7,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              ))}
            </MapContainer>
          </motion.div>
        )}

        {/* Top routes list */}
        {routes.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-1.5"
          >
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
              Other long routes
            </p>
            {routes.slice(1, 4).map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex items-center justify-between glass-card px-3 py-2 bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ROUTE_COLORS[i + 1] }}
                  />
                  <p className="text-white text-sm font-medium truncate max-w-[180px]">
                    {route.name}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-orange-400 text-sm font-bold">
                    {route.distance.toFixed(1)}
                  </span>
                  <span className="text-white/40 text-xs ml-1">km</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {routes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card px-6 py-6 bg-white/5"
          >
            <p className="text-white/60">No route data available</p>
            <p className="text-white/40 text-sm mt-2">
              Record activities with GPS to see your routes!
            </p>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}

