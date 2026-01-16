import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Get token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    if (token && username) {
      // Create auth response object matching the expected format
      const authResponse = {
        token,
        username,
        // These will be extracted from the JWT token in the auth context
        userId: 0,
        email: ''
      };

      // Login and redirect to dashboard
      login(authResponse);
      navigate('/dashboard');
    } else {
      // If no token, redirect to signin with error
      navigate('/signin?error=oauth_failed');
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuth2Redirect;
