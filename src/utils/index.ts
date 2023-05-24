import { MutableRefObject, LegacyRef, RefCallback } from "react";

export type Ref<T> = MutableRefObject<T> | LegacyRef<T> | undefined;
export function mergeRefs<T = any>(...refs: Ref<T>[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
