import { useSessionStore } from '@/entities/session'
import { SignInUserData, userApi } from '@/entities/user'
import { apiClient, isApiError } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useNotification } from '@/shared/lib/notification'

export const useSignIn = () => {
  const { showNotification } = useNotification()
  const createSession = useSessionStore((s) => s.createSession)
  const { showLoader, hideLoader } = useLoader()

  const signIn = async (data: SignInUserData) => {
    try {
      showLoader()
      const { token } = await userApi.signIn(data)
      apiClient.setToken(token)
      createSession({ username: data.username, token })
    } catch (err: unknown) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    } finally {
      hideLoader()
    }
  }

  return signIn
}
