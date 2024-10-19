import { cn } from 'src/lib/tailwind/utils'
import { EventStatus } from 'src/types/event.type'

interface Props {
  status: {
    type: EventStatus
    label?: string
  }
}

const statusClasses: Record<EventStatus, { backgroundColor: string; textColor: string }> = {
  pending: {
    backgroundColor: 'bg-semantic-secondary-background',
    textColor: 'text-semantic-secondary'
  },
  approved: {
    backgroundColor: 'bg-semantic-success-background',
    textColor: 'text-semantic-success'
  },
  rejected: {
    backgroundColor: 'bg-semantic-cancelled-background',
    textColor: 'text-semantic-cancelled'
  }
}

export default function Tag({ status }: Props) {
  const classes = statusClasses[status.type]
  return (
    <div className={cn('rounded-md p-1 text-center text-sm font-medium', classes.backgroundColor, classes.textColor)}>
      {status.label}
    </div>
  )
}
