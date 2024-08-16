import { useVerifyToken } from "@/features/check-session";
import { useLoader } from "@/shared/lib/loader";
import { Loader } from "@/shared/ui/loader";
import { Logo } from "@/shared/ui/logo";
import { ReactNode, useEffect } from "react";

const MIN_LOADER_VISIBLE_TIME_IN_MS = 1500;

export const AppLoader = ({ children }: { children?: ReactNode }) => {
  const { verifyToken } = useVerifyToken();
  const {
    isVisible: isLoaderVisible,
    showLoader,
    hideLoader,
  } = useLoader(MIN_LOADER_VISIBLE_TIME_IN_MS);

  useEffect(() => {
    const init = async () => {
      try {
        showLoader();
        await verifyToken();
      } finally {
        hideLoader();
      }
    };

    init();
  }, [hideLoader, showLoader, verifyToken]);

  if (isLoaderVisible) {
    return (
      <Loader>
        <Logo />
      </Loader>
    );
  }

  return children;
};
