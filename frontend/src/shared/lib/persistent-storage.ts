export const persistentStorage = {
  getItem: <T>(key: string): T | null => {
    const data = sessionStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },
  setItem: (key: string, data: unknown) => {
    return sessionStorage.setItem(key, JSON.stringify(data))
  },
}
