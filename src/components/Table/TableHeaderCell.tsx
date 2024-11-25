import { ReactNode, MouseEvent } from 'react'
import { cn } from 'src/lib/tailwind/utils'

type TableHeaderCellProps = {
  children: ReactNode
  className?: string
  onClick?: (event: MouseEvent<HTMLTableCellElement>) => void
}

export default function TableHeaderCell({ children, className = '', onClick }: TableHeaderCellProps) {
  return (
    <th
      className={cn('sticky z-10 whitespace-normal break-words px-4 py-2 text-left text-sm', className)}
      onClick={onClick}
    >
      {children}
    </th>
  )
}
