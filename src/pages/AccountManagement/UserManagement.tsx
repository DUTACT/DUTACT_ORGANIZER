import { useEffect, useState } from 'react'
import { getAccounts } from 'src/apis/account'
import InputSearch from 'src/components/InputSearch'
import Pagination from 'src/components/Pagination/Pagination'
import { Table, TableHeader, TableHeaderCell } from 'src/components/Table'
import { TIMEOUT } from 'src/constants/common'

export default function AccountManagement() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [appliedInputSearch, setAppliedInputSearch] = useState<string>('')
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const { data: accountsPage, isLoading, error } = getAccounts({ page, pageSize, searchQuery: appliedInputSearch })

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedInputSearch(inputSearch)
    }, TIMEOUT.DEBOUNCE)
    return () => clearTimeout(timer)
  }, [inputSearch])

  if (firstLoad && !isLoading) {
    setFirstLoad(false)
  }

  if (firstLoad) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  const accounts = accountsPage?.data
  const totalAccounts = accountsPage?.pagination.totalData

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch
              placeholder='Tìm kiếm tên tài khoản'
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
            />
          </div>
        </div>
      </div>
      <Pagination
        totalItems={totalAccounts ?? 0}
        onPageChange={(page) => setPage(page)}
        onRowsPerPageChange={(pageSize) => setPageSize(pageSize)}
      />
      <div className='text-2xl font-bold'>Quản lý tài khoản</div>
      <Table>
        <TableHeader>
          <TableHeaderCell>
            <div className='font-bold'>ID</div>
          </TableHeaderCell>
        </TableHeader>
      </Table>
    </div>
  )
}
