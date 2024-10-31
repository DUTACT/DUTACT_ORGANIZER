import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { deletePost } from 'src/apis/post'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { clearModal, setIsShowModalConfirm, setModalProperties } from 'src/redux/slices/modalConfirm'
import { useEventPosts } from './useEventPosts'
import DeletePostIcon from 'src/assets/icons/i-event.svg?react'
import { ReactNode } from 'react'

interface UseDeletePostResult {
  openPopupDeletePost: (postId: number) => void
}

export const useDeletePost = (): UseDeletePostResult => {
  const dispatch = useDispatch()
  const renderDeleteIcon: ReactNode = <DeletePostIcon className='h-[20px] w-[20px]' />
  const { deletePost: deletePostInList } = useEventPosts()

  const { mutate: mutateDeletePost } = deletePost({
    onSuccess: (postId: number) => {
      toast.success(SUCCESS_MESSAGE.DELETE_EVENT)
      dispatch(setIsShowModalConfirm(false))
      deletePostInList(postId)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const openPopupDeletePost = (postId: number): void => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Xóa bài đăng',
        question: `Bạn có chắc chắn muốn xóa bài đăng này? Bạn và những người khác sẽ không còn thấy bài đăng này ở bất cứ đâu nữa.`,
        actionConfirm: () => mutateDeletePost(postId),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Xóa bài đăng',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: renderDeleteIcon
      })
    )
  }

  return { openPopupDeletePost }
}
