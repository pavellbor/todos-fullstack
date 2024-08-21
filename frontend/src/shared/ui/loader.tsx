import { ReactNode } from 'react'

export const Loader = ({ children }: { children: ReactNode }) => {
  return <div className='loader'>{children}</div>
}
