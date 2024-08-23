import { AppLoader } from './app-loader'
import { AppProvider } from './app-provider'
import { AppRouter } from './app-router'

export const App = () => {
  return (
    <AppProvider>
      <AppLoader>
        <AppRouter />
      </AppLoader>
    </AppProvider>
  )
}
