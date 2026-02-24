import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;