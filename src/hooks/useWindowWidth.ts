import { useState, useEffect, useRef } from "react";

type UseWindowWidthOptions = {
  debounceMs?: number;
};

function useWindowWidth({
  debounceMs = 0,
}: UseWindowWidthOptions = {}): number {
  const isClient = typeof window !== "undefined";
  const [width, setWidth] = useState<number>(isClient ? window.innerWidth : 0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      if (debounceMs > 0) {
        if (timer.current !== null) {
          window.clearTimeout(timer.current);
        }
        timer.current = window.setTimeout(() => {
          setWidth(window.innerWidth);
          timer.current = null;
        }, debounceMs);
      } else {
        setWidth(window.innerWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    // cập nhật ngay khi mount
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [debounceMs, isClient]);

  return width;
}

export default useWindowWidth;
