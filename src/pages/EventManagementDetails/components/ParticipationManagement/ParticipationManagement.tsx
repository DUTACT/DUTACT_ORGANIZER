import { useEffect, useState } from 'react'
import { getParticipationsOfEvent } from 'src/apis/participation'
import InputSearch from 'src/components/InputSearch'
import Pagination from 'src/components/Pagination/Pagination'
import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import Tag from 'src/components/Tag'
import { CERTIFICATE_STATUS_COLOR_CLASSES, TIMEOUT } from 'src/constants/common'
import { ParticipationCertificateStatus, ParticipationCertificateStatusType } from 'src/types/participation.type'
import { useEventId } from 'src/hooks/useEventId'

export default function ParticipationManagement() {
  const eventId = useEventId()
  const [inputSearch, setInputSearch] = useState<string>('')
  const [appliedInputSearch, setAppliedInputSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const {
    data: participationsPage,
    isLoading,
    error
  } = getParticipationsOfEvent({
    eventId: eventId,
    searchQuery: appliedInputSearch,
    page: page,
    pageSize: rowsPerPage
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Search:', inputSearch)
      setAppliedInputSearch(inputSearch)
    }, TIMEOUT.DEBOUNCE)

    return () => clearTimeout(timer)
  }, [inputSearch])

  if (firstLoad && !isLoading) {
    setFirstLoad(false)
  }

  if (error) {
    return <div>Đã có lỗi xảy ra</div>
  }

  if (firstLoad) {
    return <div>Loading...</div>
  }

  const participations = participationsPage?.data
  const totalParticipations = participationsPage?.pagination.totalData

  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch
              placeholder='Tìm kiếm tên sinh viên'
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
            />
          </div>
        </div>
      </div>
      <Pagination
        totalItems={totalParticipations || 0}
        page={page}
        onPageChange={(page) => setPage(page)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
      />
      <div className='block overflow-auto'>
        {participations && participations.length > 0 && (
          <table className='relative min-w-full overflow-auto'>
            <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
              <tr>
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Tên sinh viên</span>
                  </div>
                </th>
                <th className='min-w-[140px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Tổng số lần check-in</span>
                  </div>
                </th>
                <th className='min-w-[140px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Xác nhận tham gia</span>
                  </div>
                </th>
                <th className='sticky right-0 z-20 whitespace-normal break-words bg-neutral-0 px-4 py-2 text-left text-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-5'>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {participations.map((participation) => (
                <tr key={participation.studentId} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                  <td className='px-4 py-2'>
                    <div className='line-clamp-3 overflow-hidden text-base font-bold'>{participation.studentName}</div>
                  </td>
                  <td className='px-4 py-2 text-sm'>{participation.totalCheckIn}</td>
                  <td className='px-4 py-2 text-sm'>
                    <Tag
                      status={getTagStatus(participation.certificateStatus)}
                      statusClasses={CERTIFICATE_STATUS_COLOR_CLASSES}
                    />
                  </td>
                  <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                    <div className='flex items-center justify-center gap-1'>
                      <div className='flex items-center justify-center p-2 opacity-70 hover:opacity-100'>
                        <ShowDetailIcon className='h-[20px] w-[20px]' />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {participations && participations.length === 0 && (
          <div className='flex h-[200px] items-center justify-center text-neutral-6'>Không có dữ liệu</div>
        )}
      </div>
    </div>
  )
}

function getTagStatus(certificateStatus?: ParticipationCertificateStatus): {
  type: ParticipationCertificateStatusType
  label: string
} {
  const statusType =
    certificateStatus?.type === 'confirmed'
      ? 'confirmed'
      : certificateStatus?.type === 'rejected'
        ? 'rejected'
        : 'pending'

  const statusLabel =
    statusType === 'confirmed' ? 'Đã xác nhận' : statusType === 'rejected' ? 'Đã từ chối' : 'Chờ xác nhận'

  return {
    type: statusType,
    label: statusLabel
  }
}
