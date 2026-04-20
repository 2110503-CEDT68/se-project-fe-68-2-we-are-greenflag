import axios from 'axios';

const api = axios.create({
  // Change to Backend URL for production deployment
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-august-pen-gay.onrender.com/api/v1',
  withCredentials: true, // Important! Allows sending Cookie/Token to Backend
});

export default api;