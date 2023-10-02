/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, useState } from "react"
import { Users } from "src/types/user.type"
import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth"

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: Users | null
  setProfile: React.Dispatch<React.SetStateAction<Users | null>>
}
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>
    (initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<Users | null>(initialAppContext.profile)
  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      profile,
      setProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}