import {
  createElement,
  useRef,
  forwardRef,
  useId,
  useLayoutEffect
} from "react";
import { UsePresence } from "../context/presenceContext";
import { HTMLMotionComponents, MotionProps } from "./types";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { mergeRefs } from "../utils";
export type CustomDomComponent<Props> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props & MotionProps> & React.RefAttributes<HTMLElement>
>;

function createMotionComponent<Props>({ Component }: { Component: string }) {
  function MotionComponent(
    props: Props & MotionProps,
    externalRef?: React.Ref<HTMLElement>
  ) {
    const elementRef = useRef<HTMLElement>(null);
    const mounted = useRef(false);
    const id = useId();

    const presence = UsePresence();

    const { children, enter, leave } = props;

    useIsomorphicLayoutEffect(() => {});

    useIsomorphicLayoutEffect(() => {
      if (!presence || !elementRef.current) return;
      const { initial, isPresent, onExitComplete, register } = presence;

      if (!mounted.current) {
        mounted.current = true;
        if (initial) return;
      }

      register(id);
      if (isPresent) {
        if (enter) {
          const animation = elementRef.current.animate(enter, {
            duration: 4000,
            fill: "forwards"
          });

          return () => animation.cancel();
        }
      } else {
        if (leave) {
          const animation = elementRef.current.animate(leave, {
            duration: 4000,
            fill: "forwards"
          });
          animation.commitStyles();
          animation.finished.then(() => {
            onExitComplete?.(id);
          });

          return () => animation.cancel();
        }
      }
    }, [presence]);

    return createElement<any>(Component, {
      ref: mergeRefs(elementRef, externalRef),
      children
    });
  }

  const ForwardRefComponent = forwardRef(MotionComponent);

  return ForwardRefComponent;
}

function createMotionProxy() {
  function custom<Props extends {}>(
    Component: string
  ): CustomDomComponent<Props> {
    return createMotionComponent<Props>({ Component });
  }

  if (typeof Proxy === "undefined") {
    return custom as typeof custom & HTMLMotionComponents;
  }

  const componentCache = new Map<string, any>();

  return new Proxy(custom, {
    get: (_target, key: string) => {
      if (!componentCache.has(key)) {
        componentCache.set(key, custom(key));
      }

      return componentCache.get(key)!;
    }
  }) as typeof custom & HTMLMotionComponents;
}

export default createMotionProxy();
