import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pathwise-j2t6.onrender.com/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract credential from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const credential = hashParams.get('credential');

        if (!credential) {
          console.error('No credential found in URL');
          navigate('/auth');
          return;
        }

        // Call backend to verify and login
        const res = await fetch(`${API_URL}/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credential }),
        });

        const data = await res.json();
        if (res.ok && data.token) {
          login(data.token, data.user);
          localStorage.setItem('justLoggedIn', 'true');
          navigate('/');
        } else {
          console.error('Google login failed:', data.message);
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Completing Google login...</p>
      </div>
    </div>
  );
}
