import { create } from "zustand";
import { Session } from "./type";
import { sessionRepository } from "./session.repository";

type SessionStore = {
  session: Session | null;
  createSession: (session: Session) => void;
  removeSession: () => void;
};

export const useSession = create<SessionStore>((set) => ({
  session: null,
  createSession: (session) => {
    set({ session });
    sessionRepository.saveSession(session);
  },
  removeSession: () => {
    set({ session: null });
    sessionRepository.clearSession();
  },
}));
