import { Button } from "./button";

export const Notification = ({
  text,
  onClose,
}: {
  text: string;
  onClose?: () => void;
}) => {
  return (
    <div className="notification">
      <span className="notification__text">{text}</span>
      <Button
        className="notification__close-button"
        icon="bi bi-x"
        onClick={onClose}
      />
    </div>
  );
};
