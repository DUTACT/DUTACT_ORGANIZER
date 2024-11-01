import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { changeStatusOfPost } from 'src/apis/post'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { clearModal, setIsShowModalConfirm, setModalProperties } from 'src/redux/slices/modalConfirm'
import { useEventPosts } from './useEventPosts'
import BlockIcon from 'src/assets/icons/i-block-warning.svg?react'
import UnlockIcon from 'src/assets/icons/i-unlock-secondary.svg?react'
import { ReactNode, useState } from 'react'
import { ChangePostStatusData } from 'src/types/post.type'

interface UseChangeStatusOfPostResult {
  postId: number
  setPostId: (postId: number) => void
  openPopupHidePost: (postId: number) => void
  openPopupUnhidePost: (postId: number) => void
}

export const useChangeStatusOfPost = (): UseChangeStatusOfPostResult => {
  const dispatch = useDispatch()
  const { updateStatusOfPost } = useEventPosts()
  const renderBlockIcon: ReactNode = <BlockIcon className='h-[20px] w-[20px]' />
  const renderUnlockIcon: ReactNode = <UnlockIcon className='h-[20px] w-[20px]' />
  const [postId, setPostId] = useState<number>(0)

  const { mutate: mutateChangeStatusOfPost } = changeStatusOfPost(postId, {
    onSuccess: (data: ChangePostStatusData) => {
      toast.success(data.type === 'removed' ? SUCCESS_MESSAGE.HIDE_EVENT_POST : SUCCESS_MESSAGE.UNHIDE_EVENT_POST)
      dispatch(setIsShowModalConfirm(false))
      updateStatusOfPost(postId, data.type)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const openPopupHidePost = (postId: number): void => {
    setPostId(postId)
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Ẩn bài đăng',
        question: `Bạn có chắc chắn muốn ẩn bài đăng này? Những người khác sẽ không còn thấy bài đăng này xuất hiện trên bảng tin của họ.`,
        actionConfirm: () => mutateChangeStatusOfPost({ type: 'removed' }),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Ẩn bài đăng',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: renderBlockIcon
      })
    )
  }

  const openPopupUnhidePost = (postId: number): void => {
    setPostId(postId)
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Hiện bài đăng',
        question: `Bạn có chắc chắn muốn hiện lại bài đăng này? Bài đăng này sẽ có thể xuất hiện lại trên bảng tin của những người khác.`,
        actionConfirm: () => mutateChangeStatusOfPost({ type: 'public' }),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Hiện bài đăng',
        titleCancel: 'Quay lại',
        isWarning: false,
        iconComponent: renderUnlockIcon
      })
    )
  }

  return { postId, setPostId, openPopupHidePost, openPopupUnhidePost }
}
