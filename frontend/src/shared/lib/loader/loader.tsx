import { ReactNode, useState, useRef, useCallback } from 'react'
import { Spinner } from '@/shared/ui/spinner'
import { loaderContext } from './loader-context'

const MIN_VISIBLE_TIME_IN_MS = 0

export const Loader = ({ children }: { children: ReactNode }) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false)
  const data = useRef<{
    minHidingTimestamp?: number
    mode?: 'overlay' | 'replace'
    renderChildren?: () => ReactNode
  }>()

  const showLoader = useCallback(
    ({
      minVisibleTimeInMS = MIN_VISIBLE_TIME_IN_MS,
      renderChildren = () => <Spinner />,
      mode = 'overlay',
    }: {
      minVisibleTimeInMS?: number
      renderChildren?: () => ReactNode
      mode?: 'overlay' | 'replace'
    } = {}) => {
      data.current = {
        minHidingTimestamp: Date.now() + minVisibleTimeInMS,
        renderChildren,
        mode,
      }

      setIsLoaderVisible(true)
    },
    [],
  )

  const hideLoader = useCallback(() => {
    const isHidingEarly = Date.now() > data.current!.minHidingTimestamp!

    if (isHidingEarly) {
      setIsLoaderVisible(false)
    } else {
      const hidingTime = data.current!.minHidingTimestamp! - Date.now()
      setTimeout(() => hideLoader(), hidingTime)
    }
  }, [])

  return (
    <loaderContext.Provider value={{ showLoader, hideLoader }}>
      {isLoaderVisible && <div className='loader'>{data.current!.renderChildren!()}</div>}
      <div
        style={{
          display: 'contents',
          visibility: isLoaderVisible && data.current!.mode === 'replace' ? 'hidden' : 'visible',
        }}>
        {children}
      </div>
    </loaderContext.Provider>
  )
}
