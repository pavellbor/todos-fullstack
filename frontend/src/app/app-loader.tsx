import { sessionRepository, useSession } from "@/entities/session";
import { userApi } from "@/entities/user";
import { apiClient } from "@/shared/lib/api-client";
import { ReactNode, useCallback, useEffect } from "react";

export const AppLoader = ({ children }: { children?: ReactNode }) => {
  const session = sessionRepository.getSession();
  const setSession = useSession((s) => s.setSession);
  console.log(session)

  apiClient.interceptors.request.use((val) => {
    if (session) {
      val.headers.Authorization = `Bearer ${session.token}`;
    }
    return val;
  });

  const verifyToken = useCallback(async () => {
    if (!session) return;
    try {
      await userApi.verifyToken(session);
      setSession(session);
    } catch (err) {
      sessionRepository.saveSession(null);
    }
  }, [session, setSession]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return children;
};
