import { ROUTER_PATHS } from "@/shared/constants/routes";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCheckSession } from "../model/use-check-session";

export const AnonymousRoute = ({ component }: { component: ReactNode }) => {
  const isAuthenticated = useCheckSession();

  return !isAuthenticated ? component : <Navigate to={ROUTER_PATHS.HOME} />;
};
