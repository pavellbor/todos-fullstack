import { useSessionStore } from '@/entities/session'

export const useCheckSession = () => {
  const session = useSessionStore((s) => s.session)
  return !!session
}
