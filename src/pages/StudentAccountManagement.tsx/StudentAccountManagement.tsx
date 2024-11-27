import { useEffect, useState } from 'react'
import { getStudentAccounts } from 'src/apis/account'
import InputSearch from 'src/components/InputSearch'
import Pagination from 'src/components/Pagination/Pagination'
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'src/components/Table'
import TableHeaderRow from 'src/components/Table/TableHeaderRow'
import { TIMEOUT } from 'src/constants/common'

export default function StudentAccountManagement() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [appliedInputSearch, setAppliedInputSearch] = useState<string>('')
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const {
    data: studentsPage,
    isLoading,
    error
  } = getStudentAccounts({ page, pageSize, searchQuery: appliedInputSearch })

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

  const students = studentsPage?.data
  const totalStudents = studentsPage?.pagination.totalData

  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch
              placeholder='Tìm kiếm email sinh viên'
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
            />
          </div>
        </div>
      </div>
      <div className='py-4'>
        <Pagination
          totalItems={totalStudents ?? 0}
          onPageChange={(page) => setPage(page)}
          onRowsPerPageChange={(pageSize) => setPageSize(pageSize)}
        />
      </div>

      {!students && <div>Loading...</div>}
      {students && students.length === 0 && <div>Không có sinh viên nào</div>}
      {students && students.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <div className='font-bold'>Email</div>
              </TableHeaderCell>
              <TableHeaderCell>
                <div className='font-bold'>Họ và tên</div>
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
