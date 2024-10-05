import { createContext, useContext, useState } from 'react'
import useLocalStorage from 'src/hooks/useLocalStorage'

export interface PageInfo {
  title: string
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  currentPageInfo: PageInfo | null
  setCurrentPageInfo: React.Dispatch<React.SetStateAction<PageInfo | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: false,
  setIsAuthenticated: () => null,
  currentPageInfo: null,
  setCurrentPageInfo: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken] = useLocalStorage<string>('access_token', '')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(accessToken))
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo | null>(initialAppContext.currentPageInfo)

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentPageInfo, setCurrentPageInfo }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
