/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (token) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
