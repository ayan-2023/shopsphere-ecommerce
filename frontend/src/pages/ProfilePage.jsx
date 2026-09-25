import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
  return <Navigate to="/login" replace />;
}

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}
        >
          My Profile
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          View your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Profile Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={30} />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 800,
              }}
            >
              {user.name}
            </h2>

            <p
              style={{
                margin: '0.25rem 0 0',
                color: 'var(--text-muted)',
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              marginBottom: '1rem',
            }}
          >
            Account Information
          </h3>

          {/* Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <User size={20} color="var(--text-muted)" />

            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.2rem',
                }}
              >
                Name
              </div>

              <div style={{ fontWeight: 600 }}>
                {user.name}
              </div>
            </div>
          </div>

          {/* Email */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <Mail size={20} color="var(--text-muted)" />

            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.2rem',
                }}
              >
                Email
              </div>

              <div style={{ fontWeight: 600 }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Role */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 0',
            }}
          >
            <ShieldCheck size={20} color="var(--text-muted)" />

            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.2rem',
                }}
              >
                Account Role
              </div>

              <div
                style={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;