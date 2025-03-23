import { createContext, PropsWithChildren, useContext } from "react";
import { useQuery } from "react-query";

import { fetchSession } from "@/api/fetch-session";

interface SessionContextType {
  hasSession?: boolean;
  isLoading: boolean;
}

const SessionContext = createContext({} as SessionContextType);
export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { data: sessionResponse, isLoading } = useQuery({
    queryFn: fetchSession,
    queryKey: ["session"],
    retry: 0,
    staleTime: Infinity,
  });

  return (
    <SessionContext.Provider
      value={{
        hasSession: !!sessionResponse?.hasSession,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
