import { useVerifyToken } from "@/features/check-session";
import { ReactNode, useEffect } from "react";

export const AppLoader = ({ children }: { children?: ReactNode }) => {
  const { verifyToken } = useVerifyToken();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return children;
};
