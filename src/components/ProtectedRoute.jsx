import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import backend from "../api/backend.js";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      // Jika tidak ada token, langsung redirect ke login
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Validasi token dengan backend menggunakan axios instance yang sudah dikonfigurasi
        const response = await backend.get("/auth/verify");

        if (response.status === 200 && response.data.success) {
          setIsAuthenticated(true);
        } else {
          // Token tidak valid atau expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        // Token invalid atau expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        // Delay 500ms untuk smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
