import { useSession } from "@/entities/session";

export const useSignOut = () => {
  const removeSession = useSession((s) => s.removeSession);
  const signOut = () => removeSession();

  return signOut;
};
