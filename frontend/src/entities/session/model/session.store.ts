import { create } from "zustand";
import { Session } from "./type";
import { sessionRepository } from "./session.repository";

type SessionStore = {
  session: Session | null;
  setSession: (session: Session) => void;
  removeSession: () => void;
};

export const useSession = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => {
    set({ session });
    sessionRepository.saveSession(session);
  },
  removeSession: () => {
    set({ session: null });
    sessionRepository.saveSession(null);
  },
}));
