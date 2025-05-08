import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return user && token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;


export const AdminProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return user && token && user.user_type === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};


