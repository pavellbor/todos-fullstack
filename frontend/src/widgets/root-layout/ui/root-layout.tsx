import { Outlet } from "react-router-dom";
import { NavLinks } from "./nav-links";
import { useCheckSession } from "@/features/check-session";
import { Profile } from "./profile";

export const RootLayout = () => {
  const isAuthenticated = useCheckSession();

  return (
    <>
      <header className="app-header">
        <span className="logo">TODOS</span>
        <div className="aside">{isAuthenticated ? <Profile /> : <NavLinks />}</div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
