import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exchangeToken } from '../services/stravaApi';
import { Loader2 } from 'lucide-react';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authorization was denied. Please try again.');
      return;
    }

    if (!code) {
      setError('No authorization code received.');
      return;
    }

    const handleAuth = async () => {
      try {
        const tokenData = await exchangeToken(code);
        login(tokenData);
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth error:', err);
        setError('Failed to complete authentication. Please try again.');
      }
    };

    handleAuth();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="slide-container bg-zinc-900">
        <div className="w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center">
          <p className="text-red-400 text-xl mb-4">😕 Authentication Failed</p>
          <p className="text-white/60 text-center mb-6 px-8">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-container bg-zinc-900">
      <div className="w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-white/60">Connecting to Strava...</p>
      </div>
    </div>
  );
}

