import { Loader } from '@/shared/lib/loader'
import { Notifications } from '@/widgets/notifications'
import { ReactNode } from 'react'

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Loader>
      <Notifications>{children}</Notifications>
    </Loader>
  )
}
