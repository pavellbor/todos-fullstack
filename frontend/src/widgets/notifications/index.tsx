import { notificationContext } from "@/shared/lib/notification";
import { Notification } from "@/shared/ui/notification";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";

type Notification = {
  id: string;
  text: string;
  timeoutId?: ReturnType<typeof setTimeout>;
};

const SHOWING_TIMEOUT_IN_MS = 3000;

export const Notifications = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (text: string) => {
    const notification: Notification = { id: nanoid(), text };

    notification.timeoutId = setTimeout(
      () => closeNotification(notification.id),
      SHOWING_TIMEOUT_IN_MS
    );

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const closeNotification = (id: string) => {
    setNotifications((prevNotifications) => {
      const filteredNotifications = prevNotifications.filter(
        (notification) => notification.id !== id
      );

      const notificationIndex = prevNotifications.findIndex(
        (notification) => notification.id === id
      );
      if (notificationIndex !== -1) {
        clearTimeout(prevNotifications[notificationIndex].timeoutId);
      }

      return filteredNotifications;
    });
  };

  return (
    <notificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notifications">
        {notifications.map((x) => (
          <Notification
            text={x.text}
            onClose={() => closeNotification(x.id)}
            key={x.id}
          />
        ))}
      </div>
    </notificationContext.Provider>
  );
};
