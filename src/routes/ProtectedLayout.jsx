// ProtectedLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { isAuthenticated , loading } = useAuth();
  console.log("auth", isAuthenticated);
  if(loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
