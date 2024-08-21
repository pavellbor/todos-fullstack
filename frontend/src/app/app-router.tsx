import { AnonymousRoute, PrivateRoute } from '@/features/check-session'
import { SignIn } from '@/pages/sign-in'
import { SignUp } from '@/pages/sign-up'
import { Tasks } from '@/pages/tasks'
import { ROUTER_PATHS } from '@/shared/constants/routes'
import { RootLayout } from '@/widgets/root-layout'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: ROUTER_PATHS.HOME,
    element: <RootLayout />,
    children: [
      {
        path: '',
        loader: () => redirect(ROUTER_PATHS.TASKS),
      },
      {
        path: ROUTER_PATHS.SIGN_IN,
        element: <AnonymousRoute component={<SignIn />} />,
      },
      {
        path: ROUTER_PATHS.SIGN_UP,
        element: <AnonymousRoute component={<SignUp />} />,
      },
      {
        path: ROUTER_PATHS.TASKS,
        element: <PrivateRoute component={<Tasks />} />,
      },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
