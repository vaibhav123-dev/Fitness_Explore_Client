import { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../common/apiRequest.js";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));

  // Persist refresh token to localStorage
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  // Automatically refresh access token on page load if refresh token exists
  useEffect(() => {
    const fetchNewAccessToken = async () => {
      if (refreshToken) {
        try {
          const { data } = await axios.post("/api/refresh-token", { token: refreshToken });
          setAccessToken(data.accessToken);
        } catch (error) {
          console.error("Error refreshing access token:", error);
          setRefreshToken(null); // Clear refresh token on error
        }
      }
    };

    fetchNewAccessToken();
  }, [refreshToken]);

  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post("/api/refresh-token", { token: refreshToken });
          setAccessToken(data.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axios(originalRequest);
        } catch (err) {
          console.error("Refresh token is expired", err);
        }
      }
      return Promise.reject(error);
    }
  );

  return { setAccessToken, setRefreshToken };
};

export default useAuth;
