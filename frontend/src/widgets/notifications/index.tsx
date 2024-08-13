import { notificationContext } from "@/shared/lib/notification";
import { Notification } from "@/shared/ui/notification";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";

export const Notifications = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<
    {
      id: string;
      text: string;
    }[]
  >([]);

  const showNotification = (text: string) => {
    const notification = { id: nanoid(), text };
    setNotifications([...notifications, notification]);
  };

  const closeNotification = (id: string) => {
    const filteredNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(filteredNotifications);
  };

  return (
    <notificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notifications">
        {notifications.map((x) => (
          <Notification text={x.text} onClose={() => closeNotification(x.id)} />
        ))}
      </div>
    </notificationContext.Provider>
  );
};
