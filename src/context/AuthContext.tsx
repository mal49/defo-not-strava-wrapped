import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { StravaAthlete, StravaTokenResponse } from '../types/strava';
import { refreshToken as refreshTokenApi } from '../services/stravaApi';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  athlete: StravaAthlete | null;
  login: (tokenData: StravaTokenResponse) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'strava_auth';

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athlete: StravaAthlete;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
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

  const logout = () => {
    setAccessToken(null);
    setRefreshTokenValue(null);
    setExpiresAt(null);
    setAthlete(null);
    localStorage.removeItem(STORAGE_KEY);
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
        isAuthenticated: !!accessToken,
        accessToken,
        athlete,
        login,
        logout,
        refreshAccessToken,
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

