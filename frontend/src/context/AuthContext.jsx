import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopsphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('shopsphere_admin_mode') === 'true';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shopsphere_token');
  });

  const [loading, setLoading] = useState(false);

  // Save user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('shopsphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopsphere_user');
    }
  }, [user]);

  // Save token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('shopsphere_token', token);
    } else {
      localStorage.removeItem('shopsphere_token');
    }
  }, [token]);

  // Save admin mode
  useEffect(() => {
    localStorage.setItem(
      'shopsphere_admin_mode',
      isAdminMode.toString()
    );
  }, [isAdminMode]);

  // LOGIN
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      const loggedInUser = {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        isAdmin: result.data.user.role === 'admin',
      };

      setUser(loggedInUser);
      setToken(result.data.token);

      if (result.data.user.role === 'admin') {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }

      return {
        success: true,
        user: loggedInUser,
      };

    } catch (error) {
      console.error('Login Error:', error);

      return {
        success: false,
        message: error.message,
      };

    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      const registeredUser = {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        isAdmin: result.data.user.role === 'admin',
      };

      setUser(registeredUser);
      setToken(result.data.token);
      setIsAdminMode(false);

      return {
        success: true,
        user: registeredUser,
      };

    } catch (error) {
      console.error('Register Error:', error);

      return {
        success: false,
        message: error.message,
      };

    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdminMode(false);

    localStorage.removeItem('shopsphere_user');
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_admin_mode');
  };

  // ADMIN MODE
  const toggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdminMode,
        login,
        register,
        logout,
        toggleAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};