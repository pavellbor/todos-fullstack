import axios, { AxiosInstance } from 'axios'

interface ApiClient extends AxiosInstance {
  setToken: (token: string) => void
  dropToken: () => void
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
}) as ApiClient

apiClient.setToken = function (token: string) {
  this.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

apiClient.dropToken = function () {
  delete this.defaults.headers.common.Authorization
}

export const isApiError = (error: unknown) => axios.isAxiosError(error)
