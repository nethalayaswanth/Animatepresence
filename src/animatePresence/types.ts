export interface AnimatePresenceProps {
  initial?: boolean;

  custom?: any;

  onExitComplete?: () => void;
  exitBeforeEnter?: boolean;

  mode?: "sync" | "wait";

  presenceAffectsLayout?: boolean;
}
