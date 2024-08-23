import { loaderContext } from './loader-context'
import { useStrictContext } from '../react'

export const useLoader = () => {
  const { showLoader, hideLoader } = useStrictContext(loaderContext)

  return { showLoader, hideLoader }
}
