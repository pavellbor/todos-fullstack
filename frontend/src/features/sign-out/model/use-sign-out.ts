import { useSessionStore } from "@/entities/session";
import { apiClient } from "@/shared/lib/api-client";

export const useSignOut = () => {
  const removeSession = useSessionStore((s) => s.removeSession);
  const signOut = () => {
    apiClient.dropToken()
    removeSession();
  }

  return signOut;
};
