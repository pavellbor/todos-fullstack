import clsx from "clsx";
import { ReactNode } from "react";

type ButtonProps = {
  icon?: string;
  text?: ReactNode;
  className?: string;
  isFilled?: boolean;
  onClick?: () => void;
};

export const Button = ({
  icon,
  isFilled,
  className,
  text,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={clsx("button", className, {
        "button--filled": isFilled,
      })}
      onClick={() => onClick?.()}
    >
      {icon && <i className={clsx("bi", icon)}></i>}
      {text}
    </button>
  );
};
