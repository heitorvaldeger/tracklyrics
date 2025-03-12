import { USER_TOKEN_KEY_LOCAL_STORAGE } from "@/constants/general";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface UserAuthType {
  token: string | null;
  hasUserLogged: boolean;
  loginUser: (token: string) => void;
  logoutUser: () => void;
}

const UserAuthContext = createContext({} as UserAuthType);
export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(USER_TOKEN_KEY_LOCAL_STORAGE));
  const hasUserLogged = !!token;

  const loginUser = (token: string) => {
    setToken(token);
    localStorage.setItem(USER_TOKEN_KEY_LOCAL_STORAGE, token);
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem(USER_TOKEN_KEY_LOCAL_STORAGE);
  };

  return (
    <UserAuthContext.Provider
      value={{
        loginUser,
        logoutUser,
        token,
        hasUserLogged,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("userAuth must be used within a UserAuthProvider");
  }

  return context;
};
