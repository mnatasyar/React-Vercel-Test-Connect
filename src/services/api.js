import axios from "axios";

const API_URL = "https://capstone-project-442014.et.r.appspot.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export const profileService = {
  getProfile: async () => {
    const { data } = await api.get("/profile");
    return data;
  },

  updateProfile: async (formData) => {
    const { data } = await api.put("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
