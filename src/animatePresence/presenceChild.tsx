import * as React from "react";
import { useId, useMemo, useEffect } from "react";
import {
  PresenceContext,
  PresenceContextProps
} from "../context/presenceContext";

import { useConstant } from "../hooks/useConstant";

interface PresenceChildProps {
  children: React.ReactElement;
  isPresent: boolean;
  onExitComplete?: () => void;
  initial?: false;
  presenceAffectsLayout?: boolean;
  mode: "sync" | "wait";
}

function newChildrenMap(): Map<string, boolean> {
  return new Map();
}

export const PresenceChild = ({
  children,
  initial,
  isPresent,
  onExitComplete,
  presenceAffectsLayout
}: PresenceChildProps) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = useId();

  const context = useMemo(
    (): PresenceContextProps => ({
      id,
      initial,
      isPresent,

      onExitComplete: (childId: string) => {
        presenceChildren.set(childId, true);

        for (const isComplete of presenceChildren.values()) {
          if (!isComplete) return;
        }

        onExitComplete && onExitComplete();
      },
      register: (childId: string) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    }),
    presenceAffectsLayout ? undefined : [isPresent]
  );

  useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);

  useEffect(() => {
    const remove =
      !isPresent &&
      !presenceChildren.size &&
      onExitComplete &&
      onExitComplete();
  }, [isPresent]);

  return (
    <PresenceContext.Provider value={context}>
      {children}
    </PresenceContext.Provider>
  );
};
