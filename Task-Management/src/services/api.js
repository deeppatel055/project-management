import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5000/api',
    baseURL: 'https://project-management-vy7e.onrender.com',
  withCredentials: true, // 👈 send cookies with each request
});

export default API;
