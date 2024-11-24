interface TableHeaderRowProps {
  children: React.ReactNode
  className?: string
}

export default function TableHeaderRow({ children, className }: TableHeaderRowProps): JSX.Element {
  return <tr className={className}>{children}</tr>
}
