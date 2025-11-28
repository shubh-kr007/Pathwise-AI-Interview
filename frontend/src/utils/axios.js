import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // dev: Vite on 5173 → backend on 5000
    : "";                     // prod: same origin as Render URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
