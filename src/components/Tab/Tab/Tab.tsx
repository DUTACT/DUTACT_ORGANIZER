import { ReactNode } from 'react'

export interface TabProps {
  label: string
  children: ReactNode
}

export default function Tab({ children }: TabProps) {
  return <>{children}</>
}
