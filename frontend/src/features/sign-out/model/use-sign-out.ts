import { useSession } from "@/entities/session";
import { apiClient } from "@/shared/lib/api-client";

export const useSignOut = () => {
  const removeSession = useSession((s) => s.removeSession);
  const signOut = () => {
    apiClient.dropToken()
    removeSession();
  }

  return signOut;
};
