import { ROUTER_PATHS } from '@/shared/constants/routes'
import { Link, useLocation } from 'react-router-dom'

export const NavLinks = () => {
  const { pathname } = useLocation()

  return (
    <div className='nav__links'>
      {pathname === ROUTER_PATHS.SIGN_UP ?
        <Link to={ROUTER_PATHS.SIGN_IN}>Sign In</Link>
      : <Link to={ROUTER_PATHS.SIGN_UP}>Sign Up</Link>}
    </div>
  )
}
