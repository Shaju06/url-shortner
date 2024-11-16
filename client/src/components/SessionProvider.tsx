"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<any>(null);

interface SessionProviderProps {
  children: React.ReactNode;
  session: any;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  const [userSession, setUserSession] = useState(session ?? null);

  useEffect(() => {
    setUserSession(session);
  }, [session, JSON.stringify(session.user)]);

  return (
    <SessionContext.Provider value={{ session: userSession, setUserSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be within a SessionProvider");
  }

  return context;
}
