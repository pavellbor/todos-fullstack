import { Notifications } from "@/widgets/notifications";
import { ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <Notifications>{children}</Notifications>;
};
