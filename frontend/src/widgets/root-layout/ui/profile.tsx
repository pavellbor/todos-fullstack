import { Session, useSession } from "@/entities/session";
import { SignOutButton } from "@/features/sign-out/ui/sign-out-button";

export const Profile = () => {
  const { username } = useSession((s) => s.session) as Session;

  return (
    <div className="profile">
      <span className="profile__name">{username}</span>
      <SignOutButton
        icon="bi-box-arrow-right"
        className="profile__logout-button"
      />
    </div>
  );
};
