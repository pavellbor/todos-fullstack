import { sessionRepository, useSessionStore } from '@/entities/session'
import { userApi } from '@/entities/user'
import { apiClient } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useCallback, useMemo } from 'react'

export const useVerifyToken = () => {
  const session = useMemo(() => sessionRepository.getSession(), [])
  const createSession = useSessionStore((s) => s.createSession)
  const { showLoader, hideLoader } = useLoader()

  if (session) {
    apiClient.setToken(session.token)
  }

  const verifyToken = useCallback(async () => {
    if (!session) return
    try {
      showLoader()
      await userApi.verifyToken(session)
      createSession(session)
    } catch (err) {
      sessionRepository.clearSession()
    } finally {
      hideLoader()
    }
  }, [session, createSession, showLoader, hideLoader])

  return { verifyToken }
}
