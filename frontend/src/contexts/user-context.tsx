import { createContext, PropsWithChildren, useContext } from "react";

interface UserContextType {
  token?: string;
}

const UserContext = createContext({} as UserContextType);
export const UserProvider = ({ children }: PropsWithChildren) => {
  return (
    <UserContext.Provider
      value={{
        token: "",
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
