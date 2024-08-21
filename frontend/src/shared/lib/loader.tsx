import { useCallback, useRef, useState } from "react";

const MIN_VISIBLE_TIME_IN_MS = 1000;

export const useLoader = (minVisibleTimeInMS = MIN_VISIBLE_TIME_IN_MS) => {
  const [isVisible, setIsVisible] = useState(false);
  const timestampRef = useRef<number>();

  const showLoader = useCallback(() => {
    timestampRef.current = Date.now();
    setIsVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    const isHidingEarly = Date.now() - timestampRef.current! > minVisibleTimeInMS;

    if (isHidingEarly) {
      setIsVisible(false);
    } else {
      const hidingTime = timestampRef.current! + minVisibleTimeInMS - Date.now();
      setTimeout(() => hideLoader(), hidingTime);
    }
  }, [minVisibleTimeInMS]);

  return {
    isVisible,
    showLoader,
    hideLoader,
  };
};
