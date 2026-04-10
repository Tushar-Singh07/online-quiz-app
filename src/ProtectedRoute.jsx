import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isLoggedIn) return <Navigate to="/" />;

  // If a specific role is required, check it
  if (requiredRole) {
    if (requiredRole === "facultyOrAdmin") {
      if (user?.role !== "admin" && user?.role !== "faculty") {
        return <Navigate to="/dashboard" />;
      }
    } else if (user?.role !== requiredRole) {
      // Wrong role — redirect to appropriate home
      if (user?.role === "faculty" || user?.role === "admin") {
        return <Navigate to="/admin" />;
      }
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
