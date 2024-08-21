import { useSessionStore } from '@/entities/session'
import { SignInUserData, userApi } from '@/entities/user'
import { apiClient, isApiError } from '@/shared/lib/api-client'
import { useNotification } from '@/shared/lib/notification'

export const useSignIn = () => {
  const { showNotification } = useNotification()
  const createSession = useSessionStore((s) => s.createSession)
  const signIn = async (data: SignInUserData) => {
    try {
      const { token } = await userApi.signIn(data)
      apiClient.setToken(token)
      createSession({ username: data.username, token })
    } catch (err: unknown) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    }
  }

  return signIn
}
