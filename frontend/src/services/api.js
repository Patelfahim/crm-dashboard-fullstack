import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const dashboardAPI = {
  getStats: () => axios.get(`${API_BASE}/dashboard/stats`),
  getLeads: () => axios.get(`${API_BASE}/dashboard/leads`),
  getTasks: () => axios.get(`${API_BASE}/dashboard/tasks`),
  getUsers: () => axios.get(`${API_BASE}/dashboard/users`),
};