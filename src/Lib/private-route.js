import { Navigate, useLocation } from "react-router-dom";

import routes from "../Config/routes";
import useAuth from "../Hooks/use-auth";

export default function PrivateRoute({ children }) {
  const { isAuthorized } = useAuth();

  if (!isAuthorized) {
    return <Navigate to={routes.home} />;
  }

  return <>{children}</>;
}
