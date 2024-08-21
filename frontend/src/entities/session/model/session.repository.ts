import { persistentStorage } from '@/shared/lib/persistent-storage'
import { Session } from './type'

const SESSION_STORAGE_KEY = 'session_storage'

export const sessionRepository = {
  getSession: () => persistentStorage.getItem<Session>(SESSION_STORAGE_KEY),
  saveSession: (session: Session) => persistentStorage.setItem(SESSION_STORAGE_KEY, session),
  clearSession: () => persistentStorage.setItem(SESSION_STORAGE_KEY, null),
}
