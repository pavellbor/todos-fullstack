import { createStrictContext, useStrictContext } from "./react";

export type NotificationContextParams = {
  showNotification: (text: string) => void;
};

export const notificationContext =
  createStrictContext<NotificationContextParams>();

export const useNotification = () => {
  const { showNotification } = useStrictContext(notificationContext);

  return { showNotification };
};
