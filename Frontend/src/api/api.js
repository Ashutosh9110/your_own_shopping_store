import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_BACKEND_URL;


const API = axios.create({
  baseURL: BASE_URL,
});

export { BASE_URL };
export default API;
