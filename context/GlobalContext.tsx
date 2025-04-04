"use client";

import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

type GlobalContextType = {
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
} | null;

const GlobalContext = createContext<GlobalContextType>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count) setUnreadCount(res.count);
      });
    }
  }, [getUnreadMessageCount, session]);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === null)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
}
