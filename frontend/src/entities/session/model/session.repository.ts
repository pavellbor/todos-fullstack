import { persistentStorage } from "@/shared/lib/persistent-storage";
import { Session } from "./type";

const SESSION_STORAGE_KEY = "session_storage";

export const sessionRepository = {
  getSession: () => persistentStorage.getItem(SESSION_STORAGE_KEY) as Session | null,
  saveSession: (session: Session | null) =>
    persistentStorage.setItem(SESSION_STORAGE_KEY, session),
};
