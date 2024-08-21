import { create } from 'zustand'
import { Session } from './type'
import { sessionRepository } from './session.repository'
import { devtools } from 'zustand/middleware'

type SessionStore = {
  session: Session | null
  createSession: (session: Session) => void
  removeSession: () => void
}

export const useSessionStore = create(
  devtools<SessionStore>(
    (set) => ({
      session: null,
      createSession: (session) => {
        set({ session }, undefined, { type: 'createSession', session })
        sessionRepository.saveSession(session)
      },
      removeSession: () => {
        set({ session: null }, undefined, { type: 'removeSession' })
        sessionRepository.clearSession()
      },
    }),
    { name: 'session', store: 'session' },
  ),
)
