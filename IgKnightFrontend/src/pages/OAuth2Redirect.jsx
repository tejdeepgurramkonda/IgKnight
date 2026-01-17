import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const username = params.get('username');
    const userId = params.get('userId');

    if (token && username) {
      // Store token and user data
      authAPI.handleOAuthCallback(token, username);
      login(token, { userId: userId ? parseInt(userId) : null, username });
      navigate('/dashboard');
    } else {
      // If no token, redirect to signin with error
      navigate('/signin?error=oauth_failed');
    }
  }, [location, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      fontSize: '1.25rem'
    }}>
      Processing authentication...
    </div>
  );
};

export default OAuth2Redirect;
