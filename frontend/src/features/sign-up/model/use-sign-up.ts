import { useSessionStore } from "@/entities/session";
import { SignUpUserData, userApi } from "@/entities/user";
import { isApiError } from "@/shared/lib/api-client";
import { useNotification } from "@/shared/lib/notification";

export const useSignUp = () => {
  const { showNotification } = useNotification();
  const createSession = useSessionStore((s) => s.createSession);
  const signUp = async (data: SignUpUserData) => {
    try {
      const { token } = await userApi.signUp(data);
      createSession({ username: data.username, token });
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message);
      }
    }
  };

  return signUp;
};
