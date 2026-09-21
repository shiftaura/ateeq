import api, { isMockMode } from './api';
import { getStoredMockUsers, saveMockUser } from '../mock/users';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // Login user
  login: async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    if (isMockMode) {
      await delay(350);

      if (!trimmedEmail || !cleanPassword) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
      }

      // Validate against mock users database
      const users = getStoredMockUsers();
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail
      );

      // Strict credential verification
      if (!matchedUser || matchedUser.password !== cleanPassword) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
      }

      // Create authenticated mock session
      const { password: _, ...sanitizedUser } = matchedUser;
      const token = 'mock_jwt_token_' + Date.now();
      return { user: sanitizedUser, token };
    }

    // STRICT REAL BACKEND MODE: POST /api/auth/login
    try {
      const response = await api.post('/auth/login', {
        email: trimmedEmail,
        password: cleanPassword,
      });

      // Support API contract: { success: true, message: "...", data: { token, user } }
      // or direct { token, user }
      const payload = response.data?.data || response.data;
      const token = payload?.token;
      const user = payload?.user;

      if (!token || !user) {
        throw new Error('Authentication response did not contain required token or user profile');
      }

      return { token, user };
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 401 || status === 400) {
          const customErr = new Error('Invalid email or password');
          customErr.status = status;
          throw customErr;
        } else if (status === 403) {
          const customErr = new Error(msg || 'Access forbidden. Please verify your account credentials.');
          customErr.status = 403;
          throw customErr;
        } else if (status === 422) {
          const customErr = new Error(msg || 'Invalid input provided. Please check all fields.');
          customErr.status = 422;
          throw customErr;
        } else if (status >= 500) {
          const customErr = new Error('Internal server error. Please try again later.');
          customErr.status = status;
          throw customErr;
        }
        const customErr = new Error(msg || `Request failed with status ${status}`);
        customErr.status = status;
        throw customErr;
      } else if (err.request) {
        const networkErr = new Error('Unable to connect to the authentication server. Please verify the backend is running at ' + (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'));
        networkErr.isNetworkError = true;
        throw networkErr;
      }
      throw err;
    }
  },

  // Register user
  register: async (userData) => {
    const trimmedEmail = (userData.email || '').trim().toLowerCase();

    if (isMockMode) {
      await delay(450);

      if (!userData.name || !trimmedEmail || !userData.password) {
        const err = new Error('Name, email, and password are required');
        err.status = 400;
        throw err;
      }

      // Check duplicate email
      const users = getStoredMockUsers();
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        const err = new Error('An account with this email address already exists.');
        err.status = 409;
        throw err;
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name.trim(),
        email: trimmedEmail,
        password: userData.password,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        phone: userData.phone || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      };

      saveMockUser(newUser);

      const { password: _, ...sanitizedUser } = newUser;
      const token = 'mock_jwt_token_' + Date.now();
      return { user: sanitizedUser, token };
    }

    // STRICT REAL BACKEND MODE: POST /api/auth/register
    try {
      const response = await api.post('/auth/register', userData);
      const payload = response.data?.data || response.data;
      return payload;
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 409) {
          const customErr = new Error('An account with this email address already exists.');
          customErr.status = 409;
          throw customErr;
        } else if (status === 422 || status === 400) {
          const customErr = new Error(msg || 'Invalid registration details. Please check the fields.');
          customErr.status = status;
          throw customErr;
        } else if (status >= 500) {
          const customErr = new Error('Server error during registration. Please try again later.');
          customErr.status = status;
          throw customErr;
        }
        const customErr = new Error(msg || 'Registration failed');
        customErr.status = status;
        throw customErr;
      } else if (err.request) {
        const networkErr = new Error('Unable to connect to the authentication server. Please check backend connection.');
        networkErr.isNetworkError = true;
        throw networkErr;
      }
      throw err;
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    if (isMockMode) {
      await delay(200);
      const stored = localStorage.getItem('mediconsult_user');
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }

    // STRICT REAL BACKEND MODE: GET /api/auth/me
    const response = await api.get('/auth/me');
    return response.data?.data || response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (isMockMode) {
      await delay(400);
      const users = getStoredMockUsers();
      const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
      if (!exists) {
        const err = new Error('No registered account found with this email address.');
        err.status = 404;
        throw err;
      }
      return { 
        success: true, 
        message: 'Password reset link simulated for ' + trimmedEmail + ' (Demo Mode)' 
      };
    }

    // STRICT REAL BACKEND MODE: POST /api/auth/forgot-password
    try {
      const response = await api.post('/auth/forgot-password', { email: trimmedEmail });
      return response.data;
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;
        if (status === 404) {
          const customErr = new Error('No registered account found with this email address.');
          customErr.status = 404;
          throw customErr;
        }
        const customErr = new Error(msg || 'Failed to process password reset.');
        customErr.status = status;
        throw customErr;
      } else if (err.request) {
        const networkErr = new Error('Unable to reach the server. Please check network connection.');
        networkErr.isNetworkError = true;
        throw networkErr;
      }
      throw err;
    }
  }
};

export default authService;
