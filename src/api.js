import axios from 'axios';

// Base URL is read from the environment at build time (Create React App)
// Set REACT_APP_API_URL in your environment (or in Vercel project settings) to point to your server.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  // you can add common headers here if needed
});

export default api;
