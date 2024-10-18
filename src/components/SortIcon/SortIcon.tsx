import SortUpIcon from 'src/assets/icons/i-sort-up.svg?react'
import SortUpActiveIcon from 'src/assets/icons/i-sort-up-secondary.svg?react'
import SortDownIcon from 'src/assets/icons/i-sort-down.svg?react'
import SortDownActiveIcon from 'src/assets/icons/i-sort-down-secondary.svg?react'
import { SortDirection } from 'src/utils/sortItems'

interface Props {
  sortDirection: SortDirection
}

export default function SortIcon({ sortDirection }: Props) {
  return (
    <div className='flex flex-col items-center justify-center'>
      {sortDirection === 'asc' && <SortUpActiveIcon className='h-[14px] w-[14px]' />}
      {sortDirection !== 'asc' && <SortUpIcon className='h-[14px] w-[14px]' />}
      {sortDirection === 'desc' && <SortDownActiveIcon className='h-[14px] w-[14px]' />}
      {sortDirection !== 'desc' && <SortDownIcon className='h-[14px] w-[14px]' />}
    </div>
  )
}
