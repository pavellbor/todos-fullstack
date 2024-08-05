import { useSession } from "@/entities/session";

export const useCheckSession = () => {
    const session = useSession((s) => s.session);
    return !!session;
  };