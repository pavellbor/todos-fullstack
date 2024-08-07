import { sessionRepository, useSession } from "@/entities/session";
import { userApi } from "@/entities/user";
import { apiClient } from "@/shared/lib/api-client";
import { useCallback } from "react";

export const useVerifyToken = () => {
  const session = sessionRepository.getSession();
  const createSession = useSession((s) => s.createSession);

  if (session) {
    apiClient.setToken(session.token);
  }

  const verifyToken = useCallback(async () => {
    if (!session) return;
    try {
      await userApi.verifyToken(session);
      createSession(session);
    } catch (err) {
      sessionRepository.clearSession();
    }
  }, [session, createSession]);

  return { verifyToken };
};
