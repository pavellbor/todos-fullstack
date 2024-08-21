import clsx from 'clsx'
import { ReactNode } from 'react'

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon?: string
  text?: ReactNode
  isFilled?: boolean
  onClick?: () => void
}

export const Button = ({ icon, isFilled, className, text, type, onClick }: ButtonProps) => {
  return (
    <button
      className={clsx('button', className, {
        'button--filled': isFilled,
      })}
      type={type}
      onClick={() => onClick?.()}>
      {icon && <i className={icon}></i>}
      {text}
    </button>
  )
}
