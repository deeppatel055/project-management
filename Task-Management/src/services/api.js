
import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // ✅ correct way
  withCredentials: true,
});

export default API;