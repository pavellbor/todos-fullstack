import { useVerifyToken } from '@/features/check-session'
import { useLoader } from '@/shared/lib/loader'
import { Logo } from '@/shared/ui/logo'
import { ReactNode, useEffect } from 'react'

const MIN_LOADER_VISIBLE_TIME_IN_MS = 1500

export const AppLoader = ({ children }: { children?: ReactNode }) => {
  const { verifyToken } = useVerifyToken()
  const { showLoader, hideLoader } = useLoader()

  useEffect(() => {
    const init = async () => {
      try {
        showLoader({
          mode: 'replace',
          minVisibleTimeInMS: MIN_LOADER_VISIBLE_TIME_IN_MS,
          renderChildren: () => <Logo />,
        })
        await verifyToken()
      } finally {
        hideLoader()
      }
    }

    init()
  }, [hideLoader, showLoader, verifyToken])

  return children
}
