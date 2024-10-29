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
import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import { toast } from 'react-toastify'
import moment from 'moment'
import {
  DATE_TIME_FORMATS,
  INITIAL_ITEMS_PER_PAGE,
  POST_STATUS_COLOR_CLASSES,
  POST_STATUS_MESSAGES
} from 'src/constants/common'
import { getStatusMessage } from 'src/utils/common'
import Tag from 'src/components/Tag'
import PostFilter from '../PostFilter'

const mockDataPosts: Post[] = [
  {
    id: 1,
    eventId: 92,
    content:
      'hân dân, không phải ai cũng có thể hạ thấp bản thân mình trước đông đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  },
  {
    id: 2,
    eventId: 92,
    content:
      'hân dân, khôngng đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-30T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'hidden'
    }
  },
  {
    id: 3,
    eventId: 92,
    content:
      'hân dân, không phải ai cũng có thể hạ thấp bản thân mình trước đông đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  },
  {
    id: 4,
    eventId: 92,
    content:
      'hân dân, kn giả như vậy, đặc biđầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  },
  {
    id: 5,
    eventId: 92,
    content:
      'hân dân, không phải ai cũng có thể hạ thấp bản thân mình trước đông đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  },
  {
    id: 6,
    eventId: 92,
    content:
      'hân dân, khôngng đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-30T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'hidden'
    }
  },
  {
    id: 7,
    eventId: 92,
    content:
      'hân dân, không phải ai cũng có thể hạ thấp bản thân mình trước đông đảo khán giả như vậy, đặc biệt là với một người có tuổi, có vị thế hàng đầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  },
  {
    id: 8,
    eventId: 92,
    content:
      'hân dân, kn giả như vậy, đặc biđầu, có quân hàm. Một hình ảnh sẽ khiến nhiều ngôi sao phải nhìn lại bản thân. Với',
    postedAt: '2024-10-29T14:42:50.376',
    coverPhotoUrl:
      'https://dutactstorageaccount.blob.core.windows.net/primary/4fdd9c85-c2d6-4d5d-9239-97c0d1fb5dba.jpg',
    status: {
      type: 'published'
    }
  }
]

export default function PostTableList() {
  const { posts: postList, error: postsError } = useEventPosts()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockDataPosts)

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

  useEffect(() => {
    if (postsError) {
      toast.error(postsError.message)
    }
  }, [postsError])

  useEffect(() => {
    if (postList) {
      const newPosts = mockDataPosts.map((post: Post) => ({
        ...post,
        postedAt: moment(post.postedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        status: {
          ...post.status,
          label: getStatusMessage(POST_STATUS_MESSAGES, post.status.type)
        }
      }))
      setPosts(newPosts)
    }
  }, [postList])

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
        {/* <div className='flex items-center gap-2'>
        <Button
          title='Tạo sự kiện mới'
          type='button'
          classButton='min-w-[100px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md gap-1'
          iconComponent={<AddIcon className='h-[20px] w-[20px]' />}
          onClick={navigateToCreateEventPage}
        />
      </div> */}
      </div>
      <Pagination
        totalItems={filteredPosts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className='max-h-main-abs block overflow-auto'>
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
                      <div className='line-clamp-6 overflow-hidden text-sm font-normal'>{post.content}</div>
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
                      {post.status.type === 'hidden' && (
                        <Tag status={post.status} statusClasses={POST_STATUS_COLOR_CLASSES} />
                      )}
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          // onClick={() => navigateToEventDetailsPage(event.id)}
                        >
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
                        </div>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          // onClick={() => navigateToUpdateEventPage(event.id)}
                        >
                          <EditIcon className='h-[20px] w-[20px]' />
                        </div>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          // onClick={() => openPopupDeleteEvent(event)}
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