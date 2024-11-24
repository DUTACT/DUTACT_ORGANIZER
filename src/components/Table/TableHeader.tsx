import { ReactNode } from 'react'

type TableHeaderProps = {
  children: ReactNode
}

export default function TableHeader({ children }: TableHeaderProps): JSX.Element {
  return (
    <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
      {children}
    </thead>
  )
}
