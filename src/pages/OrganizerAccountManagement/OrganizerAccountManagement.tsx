import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrganizerAccounts } from 'src/apis/account'
import Button from 'src/components/Button'
import InputSearch from 'src/components/InputSearch'
import Pagination from 'src/components/Pagination/Pagination'
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'src/components/Table'
import TableHeaderRow from 'src/components/Table/TableHeaderRow'
import { TIMEOUT } from 'src/constants/common'
import { path } from 'src/routes/path'
import AddIcon from 'src/assets/icons/i-plus-white.svg?react'

export default function OrganizerAccountManagement() {
  const navigate = useNavigate()
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
        <div className='max-w-[300px] flex-1'>
          <InputSearch placeholder='Tìm kiếm tên đăng nhập' inputSearch={inputSearch} setInputSearch={setInputSearch} />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            title='Tạo tài khoản'
            type='button'
            classButton='min-w-[100px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md gap-1'
            iconComponent={<AddIcon className='h-[20px] w-[20px]' />}
            onClick={() => navigate(path.createOrganizerAccount)}
          />
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
              <TableHeaderCell>
                <div className='font-bold'>Người phụ trách</div>
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {organizers.map((oganizer) => (
              <TableRow key={oganizer.id}>
                <TableCell>{oganizer.username}</TableCell>
                <TableCell>{oganizer.name}</TableCell>
                <TableCell>{oganizer.phone}</TableCell>
                <TableCell>{oganizer.personInChargeName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
