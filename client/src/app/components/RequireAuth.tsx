import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

interface RequireAuthProps {
  children?: JSX.Element; 
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const currentUser = useAppSelector((state) => state.account.user);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default RequireAuth;
