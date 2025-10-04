import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import HTTPRequest from "@/services/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // ✅ add router for redirect
import { selfMessage } from "./message/SelfMessage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load token & user from localStorage when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user"); // cleanup invalid value
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async ({ token, userData }) => {
    try {
      setToken(token);
      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { success: true, message: "Login successful." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await HTTPRequest().getAction(
        null,
        `/auth/logout`,
        true
      );
      if (response?.success) {
        selfMessage.success(response.message || "Logout Successfully");
      } else {
        selfMessage.error(response.message || "Logout Failed!");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("token");
      router.push("/login");
    }
  };

  // 🔁 Session checker (every 5 min)
  useEffect(() => {
    let interval;

    if (token) {
      interval = setInterval(async () => {
        try {
          const response = await HTTPRequest().getAction(
            null,
            "/auth/session",
            true,
            { Authorization: `Bearer ${token}` }
          );

          if (!response.success || response.code !== 200) {
            // session expired
            logout();
          }
        } catch (err) {
          console.error("Session check failed:", err);
          logout();
        }
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]); // re-run if token changes

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
