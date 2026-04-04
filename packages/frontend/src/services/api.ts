import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response]`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error Response]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// User API methods
export const userApi = {
  create: async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/users', {
      email,
      password,
      name,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
