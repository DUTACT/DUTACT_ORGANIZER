import { useState } from 'react'
import { INITIAL_ITEMS_PER_PAGE, INITIAL_PAGE } from 'src/constants/common'

interface UsePaginationProps {
  totalItems: number
  intialPage?: number
  initialItemsPerPage?: number
}

export function usePagination({
  totalItems,
  intialPage = INITIAL_PAGE,
  initialItemsPerPage = INITIAL_ITEMS_PER_PAGE
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(intialPage)
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage)

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    changeItemsPerPage
  }
}
