import { useSession } from "@/entities/session";
import { SignUpUserData, userApi } from "@/entities/user";
import { isApiError } from "@/shared/lib/api-client";
import { useNotification } from "@/shared/lib/notification";

export const useSignUp = () => {
  const { showNotification } = useNotification();
  const setSession = useSession((s) => s.setSession);
  const signUp = async (data: SignUpUserData) => {
    try {
      const { token } = await userApi.signUp(data);
      setSession({ username: data.username, token });
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message);
      }
    }
  };

  return signUp;
};
