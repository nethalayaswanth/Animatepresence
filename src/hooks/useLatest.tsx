import { useRef } from "react";

const useLatest = <T extends any>(current: T) => {
  const storedValue = useRef(current);
  if (storedValue.current !== current) {
    storedValue.current = current;
  }

  return storedValue;
};

export default useLatest;
