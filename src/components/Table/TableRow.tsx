import { ReactNode } from 'react'
import { cn } from 'src/lib/tailwind/utils'

type TableRowProps = {
  children: ReactNode
  className?: string
}

export default function TableRow({ children, className = '' }: TableRowProps): JSX.Element {
  return <tr className={cn('group border-b-[1px] border-neutral-4 hover:bg-neutral-2', className)}>{children}</tr>
}
