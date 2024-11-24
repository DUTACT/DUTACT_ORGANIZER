import { ReactNode } from 'react'

type TableBodyProps = {
  children: ReactNode
}

export default function TableBody({ children }: TableBodyProps): JSX.Element {
  return <tbody>{children}</tbody>
}
