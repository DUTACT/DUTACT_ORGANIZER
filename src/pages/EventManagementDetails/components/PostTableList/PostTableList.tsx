import { Post, PostFilterType } from 'src/types/post.type'
import { useEventPosts } from '../../hooks/useEventPosts'
import InputSearch from 'src/components/InputSearch'
import { useEffect, useMemo, useState } from 'react'
import FilterPopover from 'src/components/FilterPopover'
import Pagination from 'src/components/Pagination/Pagination'
import SortIcon from 'src/components/SortIcon'
import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import EditIcon from 'src/assets/icons/i-edit-secondary.svg?react'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import AddIcon from 'src/assets/icons/i-plus-white.svg?react'
import BlockIcon from 'src/assets/icons/i-block-warning.svg?react'
import UnlockIcon from 'src/assets/icons/i-unlock-secondary.svg?react'

import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import { toast } from 'react-toastify'
import moment from 'moment'
import {
  DATE_TIME_FORMATS,
  INITIAL_ITEMS_PER_PAGE,
  POST_STATUS_COLOR_CLASSES,
  POST_STATUS_MESSAGES,
  USER_ROLE
} from 'src/constants/common'
import { getStatusMessage } from 'src/utils/common'
import Tag from 'src/components/Tag'
import PostFilter from '../PostFilter'
import Button from 'src/components/Button'
import { useDeletePost } from '../../hooks/useDeletePost'
import { useOrganizerId } from '../../../../hooks/useOrganizerId'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { useEventId } from '../../../../hooks/useEventId'
import { useChangeStatusOfPost } from '../../hooks/useChangeStatusOfPost'
import { useUserRole } from '../../../../hooks/useUserRole'
import { useEventForModeration } from '../../hooks/useEventForModeration'
import { EventOfOrganizer } from 'src/types/event.type'
import { useDispatch } from 'react-redux'
import { setEventPostDetailState } from 'src/redux/slices/eventPostDetail'

interface PostTableListProps {
  setIsShowCreateOrUpdatePostPopup: React.Dispatch<React.SetStateAction<boolean>>
  setUpdatedPostId: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default function PostTableList({ setIsShowCreateOrUpdatePostPopup, setUpdatedPostId }: PostTableListProps) {
  const dispatch = useDispatch()
  const organizerId = useOrganizerId()
  const eventId = useEventId()
  const userRole = useUserRole()
  const { event } =
    userRole === USER_ROLE.STUDENT_AFFAIRS_OFFICE
      ? useEventForModeration(eventId)
      : useOrganizerEvent(organizerId, eventId)
  const { openPopupDeletePost } = useDeletePost()
  const { posts: postList, error: postsError } = useEventPosts()
  const { openPopupHidePost, openPopupUnhidePost } = useChangeStatusOfPost()

  const posts: Post[] = useMemo(
    () =>
      postList.map((post: Post) => ({
        ...post,
        postedAt: moment(post.postedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        status: {
          ...post.status,
          label: getStatusMessage(POST_STATUS_MESSAGES, post.status.type)
        }
      })),
    [JSON.stringify(postList)]
  )

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  const [inputSearch, setInputSearch] = useState<string>('')
  const [sortCriteria, setSortCriteria] = useState<SortCriterion<Post>[]>([
    { field: 'content', direction: null },
    { field: 'postedAt', direction: 'desc' }
  ])
  const [postFilterOptions, setPostFilterOptions] = useState<PostFilterType>({
    timeFrom: '',
    timeTo: '',
    types: []
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(INITIAL_ITEMS_PER_PAGE)

  const handleSearchPosts = (posts: Post[], value: string): Post[] => {
    const lowerCaseValue = value.trim().toLowerCase()
    return posts.filter(
      (post: Post) =>
        post.content.toLowerCase().includes(lowerCaseValue) || post.postedAt.toLowerCase().includes(lowerCaseValue)
    )
  }

  const toggleSortCriteria = (field: keyof Post): void => {
    const updatedCriteria = toggleSortDirection(sortCriteria, field)
    setSortCriteria(updatedCriteria)
  }

  const handleSortChange = (posts: Post[], criteria: SortCriterion<Post>[]): Post[] => {
    return sortItems<Post>(posts, criteria)
  }

  const handleFilterEvents = (posts: Post[], postFilterOptions: PostFilterType) => {
    return posts.filter((post) => {
      const typesMatch = postFilterOptions.types.length === 0 || postFilterOptions.types.includes(post.status.type)

      const timeFrom = postFilterOptions.timeFrom
        ? moment(postFilterOptions.timeFrom, DATE_TIME_FORMATS.DATE).startOf('day')
        : null

      const timeTo = postFilterOptions.timeTo
        ? moment(postFilterOptions.timeTo, DATE_TIME_FORMATS.DATE).endOf('day')
        : null

      const postedAt = moment(post.postedAt, DATE_TIME_FORMATS.DATE).startOf('day')

      const isPostedAtInRange =
        (!timeFrom || postedAt.isSameOrAfter(timeFrom)) && (!timeTo || postedAt.isSameOrBefore(timeTo))

      return typesMatch && isPostedAtInRange
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage)
    setCurrentPage(1)
  }

  const openPopupCreatePost = () => {
    setIsShowCreateOrUpdatePostPopup(true)
    setUpdatedPostId(undefined)
  }

  const openPopupUpdatePost = (postId: number) => {
    setIsShowCreateOrUpdatePostPopup(true)
    setUpdatedPostId(postId)
  }

  const openPopupDetailPost = (event: EventOfOrganizer, post: Post) => {
    dispatch(
      setEventPostDetailState({
        isShowEventPostDetailPopup: true,
        event,
        post
      })
    )
  }

  useEffect(() => {
    if (postsError) {
      toast.error(postsError.message)
    }
  }, [postsError])

  useEffect(() => {
    const newFilteredPosts = handleSortChange(
      handleFilterEvents(handleSearchPosts(posts, inputSearch), postFilterOptions),
      sortCriteria
    )
    setFilteredPosts(newFilteredPosts)
  }, [inputSearch, posts, postFilterOptions, sortCriteria])

  const indexOfLastPost = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage])
  const indexOfFirstPost = useMemo(() => indexOfLastPost - itemsPerPage, [indexOfLastPost, itemsPerPage])
  const currentPosts = useMemo(
    () => filteredPosts.slice(indexOfFirstPost, indexOfLastPost),
    [filteredPosts, indexOfFirstPost, indexOfLastPost]
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch placeholder='Tìm kiếm bài đăng' inputSearch={inputSearch} setInputSearch={setInputSearch} />
          </div>
          <FilterPopover
            content={(onClosePopover) => (
              <PostFilter onSendFilterOptions={setPostFilterOptions} onClosePopover={onClosePopover} />
            )}
          />
        </div>
        {organizerId === event?.organizer.id && (
          <div className='flex items-center gap-2'>
            <Button
              title='Tạo bài đăng mới'
              type='button'
              classButton='min-w-fit text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md gap-1'
              iconComponent={<AddIcon className='h-[20px] w-[20px]' />}
              onClick={openPopupCreatePost}
            />
          </div>
        )}
      </div>
      <Pagination
        totalItems={filteredPosts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className='block max-h-main-abs overflow-auto'>
        {filteredPosts.length > 0 && (
          <table className='relative min-w-full overflow-auto'>
            <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
              <tr>
                <th className='sticky left-0 z-10 bg-neutral-0 px-4 py-2 text-center before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
                  <div className='flex items-center justify-center'>
                    <input type='checkbox' className='h-[16px] w-[16px] cursor-pointer' />
                  </div>
                </th>
                <th
                  className='min-w-[150px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('content')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Nội dung bài đăng</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'content')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('postedAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Thời gian đăng</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'postedAt')} />
                  </div>
                </th>
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Ảnh bìa</span>
                  </div>
                </th>
                <th className='min-w-[120px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th className='sticky right-0 z-20 whitespace-normal break-words bg-neutral-0 px-4 py-2 text-left text-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-5'>
                  Hành động
                </th>
              </tr>
            </thead>
            {currentPosts.length > 0 && (
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                    <td className='sticky left-0 z-10 bg-neutral-0 px-4 py-2 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center'>
                        <input type='checkbox' className='h-[16px] w-[16px] cursor-pointer' />
                      </div>
                    </td>
                    <td className='px-4 py-2'>
                      <div className='line-clamp-6 overflow-hidden whitespace-pre-wrap text-sm font-normal'>
                        {post.content}
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>{post.postedAt}</td>
                    <td className='flex items-center justify-center px-4 py-2 text-sm'>
                      <img
                        src={post.coverPhotoUrl}
                        alt='ảnh bài đăng'
                        className='aspect-h-9 aspect-w-16 max-h-[100px] max-w-[300px] p-0'
                      />
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      {post.status.type === 'removed' && (
                        <Tag status={post.status} statusClasses={POST_STATUS_COLOR_CLASSES} />
                      )}
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => openPopupDetailPost(event as EventOfOrganizer, post)}
                        >
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
                        </div>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => openPopupUpdatePost(post.id)}
                        >
                          <EditIcon className='h-[20px] w-[20px]' />
                        </div>
                        {userRole === USER_ROLE.STUDENT_AFFAIRS_OFFICE && post.status.type === 'public' && (
                          <div
                            className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                            onClick={() => openPopupHidePost(post.id)}
                          >
                            <BlockIcon className='h-[20px] w-[20px]' />
                          </div>
                        )}
                        {userRole === USER_ROLE.STUDENT_AFFAIRS_OFFICE && post.status.type === 'removed' && (
                          <div
                            className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                            onClick={() => openPopupUnhidePost(post.id)}
                          >
                            <UnlockIcon className='h-[20px] w-[20px]' />
                          </div>
                        )}
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => openPopupDeletePost(post.id)}
                        >
                          <DeleteIcon className='h-[20px] w-[20px]' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {currentPosts.length === 0 && (
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
      </div>
    </div>
  )
}
