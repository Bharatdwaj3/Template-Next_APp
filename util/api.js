import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 8000,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest.url.includes('/user/refresh') || 
                        originalRequest.url.includes('/user/login');


    if (error.response?.status === 401 && !originalRequest._retry&&!isAuthRoute) {
      originalRequest._retry = true;

      try {
        console.log('Access token expired – trying to refresh login...');
        await api.post('/user/refresh');
        console.log('Refresh worked! Retrying original request...');
        return api(originalRequest);
      } catch (refreshError) {
         localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
            }
        console.error('Could not refresh token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;