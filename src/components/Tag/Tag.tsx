import { cn } from 'src/lib/tailwind/utils'

interface Props<T extends string> {
  status: {
    type: T
    label?: string
  }
  className?: string
  statusClasses: Record<T, { backgroundColor: string; textColor: string }>
}

export default function Tag<T extends string>({ status, className = '', statusClasses }: Props<T>) {
  const classes = statusClasses[status.type]
  return (
    <div
      className={cn(
        'rounded-md p-1 text-center text-sm font-medium',
        className,
        classes.backgroundColor,
        classes.textColor
      )}
    >
      {status.label}
    </div>
  )
}
