import { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return (
    <div className='block overflow-auto'>
      <table className='relative min-w-full overflow-auto'>{children}</table>
    </div>
  )
}
