import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

// Ride APIs
export const rideAPI = {
  createRide: (data) => API.post('/rides', data),
  searchRides: (params) => API.get('/rides/search', { params }),
  getMyRides: () => API.get('/rides/my-rides'),
  getRideById: (id) => API.get(`/rides/${id}`),
  updateRide: (id, data) => API.put(`/rides/${id}`, data),
  deleteRide: (id) => API.delete(`/rides/${id}`),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
};

// Payment APIs
export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  verifyPayment: (data) => API.post('/payments/verify', data),
  getPaymentHistory: () => API.get('/payments/history'),
};

// Add request interceptor to include token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('carpooler_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
