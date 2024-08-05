import { useSession } from "@/entities/session";
import { SignInUserData, userApi } from "@/entities/user";
import { isApiError } from "@/shared/lib/api-client";
import { useNotification } from "@/shared/lib/notification";

export const useSignIn = () => {
  const { showNotification } = useNotification();
  const setSession = useSession((s) => s.setSession);
  const signIn = async (data: SignInUserData) => {
    try {
      const { token } = await userApi.signIn(data);
      setSession({ username: data.username, token });
    } catch (err: unknown) {
      if (isApiError(err))  {
        showNotification(err.response?.data?.message)
      }
    }
  };

  return signIn;
};
