import { useState, useCallback } from "react";
import { useIsMounted } from "../hooks/useIsMounted";

export function useForceUpdate() {
  const isMounted = useIsMounted();
  const [forcedRenderCount, setForcedRenderCount] = useState(0);

  return useCallback(() => {
    if (isMounted.current) setForcedRenderCount(forcedRenderCount + 1);
  }, [isMounted, forcedRenderCount]);
}
