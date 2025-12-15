import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import backend from "../api/backend.js";

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
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
