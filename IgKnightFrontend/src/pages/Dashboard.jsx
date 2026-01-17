import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-bg)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'var(--secondary-bg)',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem 0'
              }}>
                Welcome, {user?.username}! ♔
              </h1>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                margin: 0
              }}>
                Your dashboard is under construction
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'var(--accent-blue)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.875rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'var(--accent-blue-dark)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'var(--accent-blue)';
              }}
            >
              Logout
            </button>
          </div>

          <div style={{
            background: 'var(--tertiary-bg)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              User Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Username:</span>
                <span style={{ color: 'var(--text-primary)' }}>{user?.username}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Email:</span>
                <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>User ID:</span>
                <span style={{ color: 'var(--text-primary)' }}>{user?.userId}</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid var(--accent-blue)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              🎉 <strong>Authentication Successful!</strong> The chess game features will be implemented next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
