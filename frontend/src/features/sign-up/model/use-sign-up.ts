import { useSessionStore } from '@/entities/session'
import { SignUpUserData, userApi } from '@/entities/user'
import { apiClient, isApiError } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useNotification } from '@/shared/lib/notification'

export const useSignUp = () => {
  const { showNotification } = useNotification()
  const createSession = useSessionStore((s) => s.createSession)
  const { showLoader, hideLoader } = useLoader()

  const signUp = async (data: SignUpUserData) => {
    try {
      showLoader()
      const { token } = await userApi.signUp(data)
      createSession({ username: data.username, token })
      apiClient.setToken(token)
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    } finally {
      hideLoader()
    }
  }

  return signUp
}
