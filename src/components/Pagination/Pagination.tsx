import { usePagination } from 'src/hooks/usePagination'
import FirstPageIcon from 'src/assets/icons/i-arrow-prev.svg?react'
import LastPageIcon from 'src/assets/icons/i-arrow-next.svg?react'
import PreviousPageIcon from 'src/assets/icons/i-chevron-left.svg?react'
import NextPageIcon from 'src/assets/icons/i-chevron-right.svg?react'
import { cn } from 'src/lib/tailwind/utils'
import { useEffect } from 'react'

interface Props {
  totalItems: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

export default function Pagination({ totalItems, onPageChange, onRowsPerPageChange }: Props) {
  const { currentPage, itemsPerPage, totalPages, nextPage, prevPage, goToPage, changeItemsPerPage } = usePagination({
    totalItems
  })

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(event.target.value)
    changeItemsPerPage(newItemsPerPage)
    onRowsPerPageChange(newItemsPerPage)
    onPageChange(1)
  }

  useEffect(() => {
    onPageChange(currentPage)
  }, [currentPage])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-1'>
        <label htmlFor='rowsPerPage' className='text-sm'>
          Tổng số sự kiện mỗi trang:
        </label>
        <select
          id='rowsPerPage'
          value={itemsPerPage}
          onChange={handleRowsPerPageChange}
          className='w-[50px] text-sm p-1 border border-neutral-4 rounded-lg outline-none'
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={totalItems}>All</option>
        </select>
      </div>
      <div className='flex items-center gap-1 text-sm'>
        <div>
          {startItem}–{endItem} trong tổng số {totalItems}
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-1 rounded-full border cursor-pointer border-neutral-5 hover:bg-neutral-3',
            {
              'opacity-30 bg-neutral-2 cursor-default': currentPage === 1
            }
          )}
        >
          <FirstPageIcon className='w-[16px] h-[16px]' onClick={() => goToPage(1)} />
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-1 rounded-full border cursor-pointer border-neutral-5 hover:bg-neutral-3',
            {
              'opacity-30 bg-neutral-2 cursor-default': currentPage === 1
            }
          )}
        >
          <PreviousPageIcon className='w-[16px] h-[16px]' onClick={prevPage} />
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-1 rounded-full border cursor-pointer border-neutral-5 hover:bg-neutral-3',
            {
              'opacity-30 bg-neutral-2 cursor-default': currentPage === totalPages
            }
          )}
        >
          <NextPageIcon className='w-[16px] h-[16px]' onClick={nextPage} />
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-1 rounded-full border cursor-pointer border-neutral-5 hover:bg-neutral-3',
            {
              'opacity-30 bg-neutral-2 cursor-default': currentPage === totalPages
            }
          )}
        >
          <LastPageIcon className='w-[16px] h-[16px]' onClick={() => goToPage(totalPages)} />
        </div>
      </div>
    </div>
  )
}
