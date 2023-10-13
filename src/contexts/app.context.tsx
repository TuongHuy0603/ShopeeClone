/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { createContext, useState } from "react"
import { ExtendedPurchases } from "src/types/purchase.type"
import { Users } from "src/types/user.type"
import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth"

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: Users | null
  setProfile: React.Dispatch<React.SetStateAction<Users | null>>
  extendPurchases: ExtendedPurchases[]
  setExtendPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchases[]>>
}
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS() as Users | null,
  setProfile: () => null,
  extendPurchases: [],
  setExtendPurchases: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [extendPurchases, setExtendPurchases] = useState<ExtendedPurchases[]>(initialAppContext.extendPurchases)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>
    (initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<Users | null>(initialAppContext.profile)
  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      profile,
      setProfile, extendPurchases, setExtendPurchases
    }}>
      {children}
    </AppContext.Provider>
  )
}