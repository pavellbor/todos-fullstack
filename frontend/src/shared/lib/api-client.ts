import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

})

export const isApiError = (error: unknown) => axios.isAxiosError(error)