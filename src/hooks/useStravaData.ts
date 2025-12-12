import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActivities } from '../services/stravaApi';
import { processActivities } from '../services/dataProcessing';
import { filterActivitiesByYear, getAvailableYearsFromActivities } from '../services/stravaExportParser';
import type { StravaActivity, WrappedStats } from '../types/strava';

interface UseStravaDataReturn {
  activities: StravaActivity[];
  stats: WrappedStats | null;
  isLoading: boolean;
  error: string | null;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  kudosGiven: number | null;
  refetch: () => Promise<void>;
}

export function useStravaData(): UseStravaDataReturn {
  const { accessToken, refreshAccessToken, logout, isFileUploadMode, uploadedActivities, kudosGiven } = useAuth();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate available years based on mode
  const availableYears = useMemo(() => {
    if (isFileUploadMode && uploadedActivities) {
      // Get years from uploaded activities
      const yearsFromActivities = getAvailableYearsFromActivities(uploadedActivities);
      return yearsFromActivities.length > 0 ? yearsFromActivities : [new Date().getFullYear()];
    }
    // Default: current year back to 2010
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - 2009 },
      (_, i) => currentYear - i
    );
  }, [isFileUploadMode, uploadedActivities]);

  // Auto-select the most recent year with activities in file upload mode
  useEffect(() => {
    if (isFileUploadMode && availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [isFileUploadMode, availableYears, selectedYear]);

  // Process uploaded activities when in file upload mode
  useEffect(() => {
    if (isFileUploadMode && uploadedActivities) {
      setIsLoading(true);
      setError(null);

      try {
        // Filter activities by selected year
        const yearActivities = filterActivitiesByYear(uploadedActivities, selectedYear);
        setActivities(yearActivities);

        // Process stats
        const processedStats = processActivities(yearActivities);
        setStats(processedStats);
      } catch (err) {
        console.error('Error processing uploaded activities:', err);
        setError('Failed to process activities');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isFileUploadMode, uploadedActivities, selectedYear]);

  const fetchData = useCallback(async () => {
    // Skip API fetch if in file upload mode
    if (isFileUploadMode) return;
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
  }, [accessToken, selectedYear, refreshAccessToken, logout, isFileUploadMode]);

  useEffect(() => {
    if (accessToken && !isFileUploadMode) {
      fetchData();
    }
  }, [accessToken, selectedYear, fetchData, isFileUploadMode]);

  return {
    activities,
    stats,
    isLoading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
    kudosGiven,
    refetch: fetchData,
  };
}
