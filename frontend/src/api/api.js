import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");

      const path = window.location.pathname;

      if (!path.includes("/login") && !path.includes("/register")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;