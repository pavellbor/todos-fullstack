import { ReactNode } from 'react'
import { createStrictContext } from '../react'

export type LoaderContextDeps = {
  showLoader: (options?: {
    minVisibleTimeInMS?: number
    renderChildren?: () => ReactNode
    mode?: 'overlay' | 'replace'
  }) => void
  hideLoader: () => void
}

export const loaderContext = createStrictContext<LoaderContextDeps>()
