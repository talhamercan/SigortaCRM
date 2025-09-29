import axios from "axios";

const API_URL = "http://localhost:5082/api"; // Backend API adresin

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCustomers = () => api.get("/customer");
export const addCustomer = (data) => api.post("/customer", data);
export const deleteCustomer = (id) => api.delete(`/customer/${id}`);
export const login = (data) => api.post("/auth/login", data);
// Diğer endpointler için de benzer fonksiyonlar eklenebilir 