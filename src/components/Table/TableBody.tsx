import { ReactNode } from 'react'

type TableBodyProps = {
  children: ReactNode
}

export default function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>
}
