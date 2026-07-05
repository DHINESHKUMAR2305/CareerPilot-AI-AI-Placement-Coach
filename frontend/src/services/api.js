import axios from 'axios';

const api = axios.create({
  baseURL: 'https://careerpilot-ai-ai-placement-coach.onrender.com/api',
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
