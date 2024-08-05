import { apiClient } from "@/shared/lib/api-client";
import {
  SignInUserData,
  SignUpUserData,
  VerifyTokenData,
} from "../model/types";

export const userApi = {
  signIn: async (data: SignInUserData) => {
    const { data: response } = await apiClient.post<{
      message: string;
      token: string;
    }>("/login", data);
    return response;
  },
  signUp: async (data: SignUpUserData) => {
    const { data: response } = await apiClient.post<{
      message: string;
      token: string;
    }>("/register", data);
    return response;
  },
  verifyToken: async (data: VerifyTokenData) => {
    return apiClient.post<{ message: string }>("/verify", data);
  },
};
