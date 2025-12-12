import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActivities } from '../services/stravaApi';
import { processActivities } from '../services/dataProcessing';
import type { StravaActivity, WrappedStats } from '../types/strava';

interface UseStravaDataReturn {
  activities: StravaActivity[];
  stats: WrappedStats | null;
  isLoading: boolean;
  error: string | null;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  refetch: () => Promise<void>;
}

export function useStravaData(): UseStravaDataReturn {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate available years (current year back to 2010)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2009 },
    (_, i) => currentYear - i
  );

  const fetchData = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedActivities = await getActivities(accessToken, selectedYear);
      setActivities(fetchedActivities);
      
      const processedStats = processActivities(fetchedActivities);
      setStats(processedStats);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'UNAUTHORIZED') {
          try {
            await refreshAccessToken();
            // Retry after refresh
            const fetchedActivities = await getActivities(accessToken, selectedYear);
            setActivities(fetchedActivities);
            const processedStats = processActivities(fetchedActivities);
            setStats(processedStats);
          } catch {
            logout();
            setError('Session expired. Please login again.');
          }
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, selectedYear, refreshAccessToken, logout]);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken, selectedYear, fetchData]);

  return {
    activities,
    stats,
    isLoading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
    refetch: fetchData,
  };
}

