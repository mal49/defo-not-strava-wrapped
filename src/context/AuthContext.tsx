import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { StravaAthlete, StravaTokenResponse, StravaActivity } from '../types/strava';
import { refreshToken as refreshTokenApi } from '../services/stravaApi';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  athlete: StravaAthlete | null;
  login: (tokenData: StravaTokenResponse) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  // File upload mode
  isFileUploadMode: boolean;
  uploadedActivities: StravaActivity[] | null;
  loginWithFileUpload: (activities: StravaActivity[], athlete: StravaAthlete) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'strava_auth';
const FILE_UPLOAD_KEY = 'strava_file_upload';

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athlete: StravaAthlete;
}

interface StoredFileUpload {
  activities: StravaActivity[];
  athlete: StravaAthlete;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);
  
  // File upload mode state
  const [isFileUploadMode, setIsFileUploadMode] = useState(false);
  const [uploadedActivities, setUploadedActivities] = useState<StravaActivity[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    // First check for file upload data
    const fileUploadStored = localStorage.getItem(FILE_UPLOAD_KEY);
    if (fileUploadStored) {
      try {
        const data: StoredFileUpload = JSON.parse(fileUploadStored);
        setUploadedActivities(data.activities);
        setAthlete(data.athlete);
        setIsFileUploadMode(true);
        return; // Don't check for API auth if file upload mode
      } catch {
        localStorage.removeItem(FILE_UPLOAD_KEY);
      }
    }

    // Check for API auth
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredAuth = JSON.parse(stored);
        setAccessToken(data.accessToken);
        setRefreshTokenValue(data.refreshToken);
        setExpiresAt(data.expiresAt);
        setAthlete(data.athlete);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Check if token needs refresh
  useEffect(() => {
    if (expiresAt && refreshTokenValue) {
      const now = Date.now() / 1000;
      const timeUntilExpiry = expiresAt - now;
      
      // Refresh if less than 10 minutes until expiry
      if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
        refreshAccessToken();
      }
    }
  }, [expiresAt, refreshTokenValue]);

  const login = (tokenData: StravaTokenResponse) => {
    // Clear any file upload data when logging in via API
    setIsFileUploadMode(false);
    setUploadedActivities(null);
    localStorage.removeItem(FILE_UPLOAD_KEY);

    setAccessToken(tokenData.access_token);
    setRefreshTokenValue(tokenData.refresh_token);
    setExpiresAt(tokenData.expires_at);
    setAthlete(tokenData.athlete);

    const stored: StoredAuth = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_at,
      athlete: tokenData.athlete,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  };

  const loginWithFileUpload = (activities: StravaActivity[], athleteData: StravaAthlete) => {
    // Clear any API auth data when using file upload
    setAccessToken(null);
    setRefreshTokenValue(null);
    setExpiresAt(null);
    localStorage.removeItem(STORAGE_KEY);

    setUploadedActivities(activities);
    setAthlete(athleteData);
    setIsFileUploadMode(true);

    const stored: StoredFileUpload = {
      activities,
      athlete: athleteData,
    };
    localStorage.setItem(FILE_UPLOAD_KEY, JSON.stringify(stored));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshTokenValue(null);
    setExpiresAt(null);
    setAthlete(null);
    setIsFileUploadMode(false);
    setUploadedActivities(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FILE_UPLOAD_KEY);
  };

  const refreshAccessToken = async () => {
    if (!refreshTokenValue) return;

    try {
      const tokenData = await refreshTokenApi(refreshTokenValue);
      login(tokenData);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken || isFileUploadMode,
        accessToken,
        athlete,
        login,
        logout,
        refreshAccessToken,
        isFileUploadMode,
        uploadedActivities,
        loginWithFileUpload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
