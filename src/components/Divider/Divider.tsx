import { cn } from 'src/lib/tailwind/utils'

interface Props {
  className?: string
}

export default function Divider({ className = '' }: Props) {
  return <div className={cn('w-full h-[1px] bg-neutral-3', className)}></div>
}
