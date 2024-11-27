import { useEffect, useState } from 'react'
import { getOrganizerAccounts } from 'src/apis/account'
import InputSearch from 'src/components/InputSearch'
import Pagination from 'src/components/Pagination/Pagination'
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'src/components/Table'
import TableHeaderRow from 'src/components/Table/TableHeaderRow'
import { TIMEOUT } from 'src/constants/common'

export default function OrganizerAccountManagement() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [appliedInputSearch, setAppliedInputSearch] = useState<string>('')
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const {
    data: organizersPage,
    isLoading,
    error
  } = getOrganizerAccounts({ page, pageSize, searchQuery: appliedInputSearch })

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

  const organizers = organizersPage?.data
  const totalOrganizers = organizersPage?.pagination.totalData

  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch
              placeholder='Tìm kiếm tên đăng nhập'
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
            />
          </div>
        </div>
      </div>
      <div className='py-4'>
        <Pagination
          totalItems={totalOrganizers ?? 0}
          onPageChange={(page) => setPage(page)}
          onRowsPerPageChange={(pageSize) => setPageSize(pageSize)}
        />
      </div>

      {!organizers && <div>Loading...</div>}
      {organizers && organizers.length === 0 && <div>Không có dữ liệu</div>}
      {organizers && organizers.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <div className='font-bold'>Tên đăng nhập</div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className='font-bold'>Tên tổ chức</div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className='font-bold'>Số điện thoại</div>
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {organizers.map((oganizer) => (
              <TableRow key={oganizer.id}>
                <TableCell>{oganizer.username}</TableCell>
                <TableCell>{oganizer.name}</TableCell>
                <TableCell>{oganizer.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
