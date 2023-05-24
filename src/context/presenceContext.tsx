import { createContext, useContext } from "react";

export interface PresenceContextProps {
  id: string;
  isPresent: boolean;
  register: (id: string) => () => void;
  onExitComplete?: (id: string) => void;
  initial?: false;
}

export const PresenceContext = createContext<PresenceContextProps | null>(null);

export const UsePresence = () => {
  const context = useContext(PresenceContext);
  return context;
};
