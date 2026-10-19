import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (role && getRole() !== role) {
    return <Navigate to="/workshops" replace />;
  }

  return children;
}

export default ProtectedRoute;
