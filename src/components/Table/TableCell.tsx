import { ReactNode } from 'react'

type TableCellProps = {
  children: ReactNode
  className?: string
  colSpan?: number
}

export default function TableCell({ children, className, colSpan }: TableCellProps): JSX.Element {
  return (
    <td className={`px-4 py-2 ${className || ''}`} colSpan={colSpan}>
      {children}
    </td>
  )
}
