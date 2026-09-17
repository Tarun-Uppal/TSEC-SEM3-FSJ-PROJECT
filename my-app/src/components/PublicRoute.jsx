import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && profile) {
    if (profile.user_type === "consumer") {
      return <Navigate to="/consumer/dashboard" replace />;
    }

    if (profile.user_type === "company") {
      return <Navigate to="/company/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;