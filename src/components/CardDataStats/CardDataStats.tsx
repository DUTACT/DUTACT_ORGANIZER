import { ReactNode } from 'react'

interface CardDataStatsProps {
  title: string
  total: number
  children: ReactNode
}

export default function CardDataStats({ title, total, children }: CardDataStatsProps) {
  return (
    <div className='flex items-center gap-4 rounded-2xl border border-neutral-3 bg-neutral-1 px-6 py-6 shadow-custom'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-semantic-secondary-background/30'>
        {children}
      </div>
      <div className='flex items-end justify-between'>
        <div>
          <h4 className='text-2xl font-bold text-neutral-7'>{total}</h4>
          <span className='text-base font-medium text-neutral-5'>{title}</span>
        </div>
      </div>
    </div>
  )
}
