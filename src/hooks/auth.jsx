import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../common/apiRequest.js";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refreshToken") || null;
  });

  const dispatch = useDispatch();

  // Persist tokens and user to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }

    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [accessToken, refreshToken, currentUser]);

  // Automatically refresh access token on page load if refresh token exists
  useEffect(() => {
    const fetchNewAccessToken = async () => {
      if (refreshToken && !accessToken) {
        try {
          const { data } = await axios.post("/api/refresh-token", { token: refreshToken });
          setAccessToken(data.accessToken);
        } catch (error) {
          console.error("Error refreshing access token:", error);
          setRefreshToken(null); // Clear refresh token on error
          setCurrentUser(null);
        }
      }
    };

    fetchNewAccessToken();
  }, [refreshToken]);

  // Configure axios instance
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post("/api/refresh-token", { token: refreshToken });
            setAccessToken(data.accessToken);
            originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (err) {
            console.error("Refresh token is expired", err);
            setAccessToken(null);
            setRefreshToken(null);
            setCurrentUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  const updateUser = (user) => {
    console.log(user);
    setCurrentUser(user?.user);
    setAccessToken(user.accessToken);
    setRefreshToken(user.refreshToken);
    dispatch(setUser(user?.data?.user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
