import {
  useRef,
  isValidElement,
  cloneElement,
  Children,
  ReactElement,
  ReactNode,
  useContext
} from "react";
import * as React from "react";
import { AnimatePresenceProps } from "./types";
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useIsMounted } from "../hooks/useIsMounted";

import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useUnmountEffect } from "../hooks/useUnMountEffect";
import { PresenceChild } from "./presenceChild";

type ComponentKey = string | number;

const getChildKey = (child: ReactElement<any>): ComponentKey => child.key || "";

function updateChildLookup(
  children: ReactElement<any>[],
  allChildren: Map<ComponentKey, ReactElement<any>>
) {
  children.forEach((child) => {
    const key = getChildKey(child);
    allChildren.set(key, child);
  });
}

function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child);
  });

  return filtered;
}

export const AnimatePresence: React.FunctionComponent<React.PropsWithChildren<
  AnimatePresenceProps
>> = ({
  children,

  initial = true,
  onExitComplete,
  exitBeforeEnter,
  presenceAffectsLayout = true,
  mode = "sync"
}) => {
  const forceRender = useForceUpdate();

  const isMounted = useIsMounted();

  const filteredChildren = onlyElements(children);
  let childrenToRender = filteredChildren;

  const exitingChildren = useRef(
    new Map<ComponentKey, ReactElement<any> | undefined>()
  ).current;

  const presentChildren = useRef(childrenToRender);

  const allChildren = useRef(new Map<ComponentKey, ReactElement<any>>())
    .current;

  const isInitialRender = useRef(true);

  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;

    updateChildLookup(filteredChildren, allChildren);
    presentChildren.current = childrenToRender;
  });

  useUnmountEffect(() => {
    isInitialRender.current = true;
    allChildren.clear();
    exitingChildren.clear();
  });

  if (isInitialRender.current) {
    return (
      <>
        {childrenToRender.map((child) => (
          <PresenceChild
            key={getChildKey(child)}
            isPresent
            initial={initial ? undefined : false}
            mode={mode}
            presenceAffectsLayout={presenceAffectsLayout}
          >
            {child}
          </PresenceChild>
        ))}
      </>
    );
  }

  childrenToRender = [...childrenToRender];

  const presentKeys = presentChildren.current.map(getChildKey);
  const targetKeys = filteredChildren.map(getChildKey);

  const numPresent = presentKeys.length;
  for (let i = 0; i < numPresent; i++) {
    const key = presentKeys[i];

    if (targetKeys.indexOf(key) === -1 && !exitingChildren.has(key)) {
      exitingChildren.set(key, undefined);
    }
  }

  if (mode === "wait" && exitingChildren.size) {
    childrenToRender = [];
  }

  exitingChildren.forEach((component, key) => {
    if (targetKeys.indexOf(key) !== -1) return;

    const child = allChildren.get(key);
    if (!child) return;

    const insertionIndex = presentKeys.indexOf(key);

    let exitingComponent = component;
    if (!exitingComponent) {
      const onExit = () => {
        allChildren.delete(key);
        exitingChildren.delete(key);

        const removeIndex = presentChildren.current.findIndex(
          (presentChild) => presentChild.key === key
        );
        presentChildren.current.splice(removeIndex, 1);

        if (!exitingChildren.size) {
          presentChildren.current = filteredChildren;

          if (isMounted.current === false) return;

          forceRender();
          onExitComplete && onExitComplete();
        }
      };

      exitingComponent = (
        <PresenceChild
          key={getChildKey(child)}
          isPresent={false}
          onExitComplete={onExit}
          presenceAffectsLayout={presenceAffectsLayout}
          mode={mode}
        >
          {child}
        </PresenceChild>
      );
      exitingChildren.set(key, exitingComponent);
    }

    childrenToRender.splice(insertionIndex, 0, exitingComponent);
  });

  childrenToRender = childrenToRender.map((child) => {
    const key = child.key as string | number;
    return exitingChildren.has(key) ? (
      child
    ) : (
      <PresenceChild key={getChildKey(child)} isPresent mode={mode}>
        {child}
      </PresenceChild>
    );
  });

  if (
    process.env.NODE_ENV !== "production" &&
    mode === "wait" &&
    childrenToRender.length > 1
  ) {
    console.warn(
      `You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`
    );
  }

  return (
    <>
      {exitingChildren.size
        ? childrenToRender
        : childrenToRender.map((child) => cloneElement(child))}
    </>
  );
};
