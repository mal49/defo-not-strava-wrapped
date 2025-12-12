import type { StravaActivity, StravaTokenResponse } from '../types/strava';

const API_BASE = '/api';
const STRAVA_API = 'https://www.strava.com/api/v3';

export async function getAuthUrl(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/url`);
  const data = await response.json();
  return data.url;
}

export async function exchangeToken(code: string): Promise<StravaTokenResponse> {
  const response = await fetch(`${API_BASE}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange token');
  }

  return response.json();
}

export async function refreshToken(refresh_token: string): Promise<StravaTokenResponse> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function getActivities(
  accessToken: string,
  year: number
): Promise<StravaActivity[]> {
  const startOfYear = new Date(year, 0, 1).getTime() / 1000;
  const endOfYear = new Date(year, 11, 31, 23, 59, 59).getTime() / 1000;

  const allActivities: StravaActivity[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const url = `${STRAVA_API}/athlete/activities?after=${startOfYear}&before=${endOfYear}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch activities');
    }

    const activities: StravaActivity[] = await response.json();
    
    if (activities.length === 0) {
      break;
    }

    allActivities.push(...activities);
    
    if (activities.length < perPage) {
      break;
    }

    page++;
  }

  return allActivities;
}

