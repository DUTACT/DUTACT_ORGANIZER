import InputSearch from 'src/components/InputSearch'
import { useMemo, useState } from 'react'
import Pagination from 'src/components/Pagination/Pagination'
import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import { toast } from 'react-toastify'
import { DATE_TIME_FORMATS, INITIAL_ITEMS_PER_PAGE } from 'src/constants/common'
import { useOrganizerId } from '../../../../hooks/useOrganizerId'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { useEventId } from '../../../../hooks/useEventId'
import { useDispatch } from 'react-redux'
import { deleteFeedback, getFeedbacksOfEvent } from 'src/apis/feedback'
import { Feedback } from 'src/types/feedback.type'
import FeedbackDetailsPopup from './FeedbackDetailsPopup'
import { clearModal, setModalProperties } from 'src/redux/slices/modalConfirm'
import moment from 'moment'
import { useQueryClient } from '@tanstack/react-query'

export default function FeedbackManagement() {
  const dispatch = useDispatch()
  const eventId = useEventId()
  const organizerId = useOrganizerId()
  const { event } = useOrganizerEvent(organizerId, eventId)
  const [inputSearch, setInputSearch] = useState('')
  const { data: feedbacks } = getFeedbacksOfEvent(eventId)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_ITEMS_PER_PAGE)
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [feedbacksInPage, setFeedbacksInPage] = useState<Feedback[]>([])
  const [selectedFeedbackToShowDetail, setSelectedFeedbackToDetail] = useState<Feedback | null>(null)
  const queryClient = useQueryClient()
  const { mutate: mutateDeleteFeedback } = deleteFeedback({
    onSuccess: () => {
      toast.success('Xóa phản hồi thành công')
      dispatch(setModalProperties({ isShow: false }))
      queryClient.invalidateQueries({
        queryKey: ['getFeedbacks', eventId]
      })
    },
    onError: (error) => {
      toast.error('Xóa phản hồi thất bại')
      console.error(error)
      dispatch(setModalProperties({ isShow: false }))
    }
  })

  useMemo(() => {
    if (feedbacks) {
      setFilteredFeedbacks(applySearch(feedbacks, inputSearch))
    }
  }, [feedbacks])

  useMemo(() => {
    if (filteredFeedbacks) {
      setFeedbacksInPage(applyPagination(filteredFeedbacks, page, itemsPerPage))
    }
  }, [filteredFeedbacks, page, itemsPerPage])

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleRowsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
  }

  const openDeleteFeedbackPopup = (feedback: Feedback) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Xóa phản hồi',
        question: `Bạn có chắc chắn muốn xóa phản hồi này? Bạn và những người khác sẽ không còn thấy phản hồi này ở bất cứ đâu nữa.`,
        actionConfirm: () => mutateDeleteFeedback(feedback.id),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Xóa phản hồi',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: <DeleteIcon className='h-[20px] w-[20px]' />
      })
    )
  }

  if (!feedbacks || !event) return <div>Loading...</div>

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch placeholder='Tìm kiếm phản hồi' inputSearch={inputSearch} setInputSearch={setInputSearch} />
          </div>
        </div>
      </div>
      <Pagination
        totalItems={filteredFeedbacks.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className='block max-h-main-abs overflow-auto'>
        {filteredFeedbacks.length > 0 && (
          <table className='relative min-w-full overflow-auto'>
            <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
              <tr>
                <th className='min-w-[250px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Nội dung</span>
                  </div>
                </th>
                <th className='min-w-[140px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Thời gian đăng</span>
                  </div>
                </th>
                <th className='sticky right-0 z-20 whitespace-normal break-words bg-neutral-0 px-4 py-2 text-left text-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-5'>
                  Hành động
                </th>
              </tr>
            </thead>
            {feedbacksInPage.length > 0 && (
              <tbody>
                {feedbacksInPage.map((feedback) => (
                  <tr key={feedback.id} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                    <td className='px-4 py-2'>
                      <div className='line-clamp-6 overflow-hidden whitespace-pre-wrap text-sm font-normal'>
                        {feedback.content}
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      {moment(feedback.postedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => setSelectedFeedbackToDetail(feedback)}
                        >
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
                        </div>
                        <div className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'>
                          <DeleteIcon className='h-[20px] w-[20px]' onClick={() => openDeleteFeedbackPopup(feedback)} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {feedbacks.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={10} className='py-4 text-center'>
                    Không có kết quả
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
        {selectedFeedbackToShowDetail && (
          <FeedbackDetailsPopup
            feedback={selectedFeedbackToShowDetail}
            onClose={() => setSelectedFeedbackToDetail(null)}
            event={event}
          />
        )}
      </div>
    </div>
  )
}

const applySearch = (items: Feedback[], search: string): Feedback[] => {
  return items.filter((item) => item.content.toLowerCase().includes(search.toLowerCase()))
}

const applyPagination = (items: Feedback[], page: number, itemsPerPage: number): Feedback[] => {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return items.slice(startIndex, endIndex)
}
