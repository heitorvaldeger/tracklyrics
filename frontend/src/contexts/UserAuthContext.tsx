import { createContext, PropsWithChildren, useContext, useState } from "react";

interface UserAuthType {
  token: string | null
  isAllowed: boolean
  loginUser: (token: string) => void
  logoutUser: () => void
}

const UserAuthContext = createContext({} as UserAuthType)
export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("user-token"))
  const isAllowed = !!token

  const loginUser = (token: string) => {
    setToken(token)
    localStorage.setItem("user-token", token)
  }

  const logoutUser = () => {
    setToken(null)
    localStorage.removeItem("user-token")
  }

  return (
    <UserAuthContext.Provider value={{
      loginUser, logoutUser, token, isAllowed
    }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("userAuth must be used within a UserAuthProvider");
  }

  return context;
}