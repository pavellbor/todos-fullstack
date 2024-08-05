import { Button } from "@/shared/ui/button";
import { useSignOut } from "../model/use-sign-out";

export const SignOutButton = ({
  className,
  icon,
  text,
}: {
  className?: string;
  icon?: string;
  text?: string;
}) => {
  const signOut = useSignOut();
  return (
    <Button className={className} icon={icon} text={text} onClick={signOut} />
  );
};
