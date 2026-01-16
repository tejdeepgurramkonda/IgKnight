import api from './api';

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  country: string;
}

export interface SignInData {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
}

export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
