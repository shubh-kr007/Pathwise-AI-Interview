import axios from "axios";

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_API_URL|| 'http://localhost:5000';

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});