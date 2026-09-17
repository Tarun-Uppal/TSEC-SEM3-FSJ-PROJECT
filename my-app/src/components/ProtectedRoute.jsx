import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedType }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedType && profile?.user_type !== allowedType) {
    if (profile?.user_type === "consumer") {
      return <Navigate to="/consumer/dashboard" replace />;
      return <Navigate to="/ClaimForm" replace />;
    }

    if (profile?.user_type === "company") {
      return <Navigate to="/company/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;