import { cn } from 'src/lib/tailwind/utils'

interface Props {
  className?: string
}

export default function Divider({ className = '' }: Props) {
  return <div className={cn('min-h-[1px] w-full bg-neutral-3', className)}></div>
}
