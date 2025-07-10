import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const { user, access_token, refresh_token } = response.data;
      
      // Save tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Update state
      setUser(user);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { user, access_token, refresh_token } = response.data;
      
      // Save tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Update state
      setUser(user);
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      return false;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await api.post('/api/auth/change-password', passwordData);
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to change password';
      toast.error(message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};