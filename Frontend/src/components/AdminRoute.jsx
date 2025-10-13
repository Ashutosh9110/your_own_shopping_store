import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Redirect non-admin users to homepage
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
