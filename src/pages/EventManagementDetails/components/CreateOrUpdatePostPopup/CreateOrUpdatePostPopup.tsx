import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Divider from 'src/components/Divider'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { useOrganizerId } from '../../../../hooks/useOrganizerId'
import { useEventId } from '../../../../hooks/useEventId'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { useForm, useWatch } from 'react-hook-form'
import { createPost, updatePost } from 'src/apis/post'
import { toast } from 'react-toastify'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { CoverPhotoData, PostBody } from 'src/types/post.type'
import { useEventPosts } from '../../hooks/useEventPosts'
import { cn } from 'src/lib/tailwind/utils'
import { usePost } from '../../hooks/usePost'
import { useEffect } from 'react'
import DraggableImages from 'src/components/DraggableImages'

interface CreateOrUpdatePostPopupProps {
  setIsShowCreateOrUpdatePostPopup: React.Dispatch<React.SetStateAction<boolean>>
  updatedPostId: number | undefined
}

type FormData = Partial<PostBody> & {
  coverPhotoArray?: Array<CoverPhotoData>
}

export default function CreateOrUpdatePostPopup({
  setIsShowCreateOrUpdatePostPopup,
  updatedPostId
}: CreateOrUpdatePostPopupProps) {
  const organizerId = useOrganizerId()
  const eventId = useEventId()
  const { event } = useOrganizerEvent(organizerId, eventId)
  const { addPost } = useEventPosts()
  const { post, updatePostInList } = updatedPostId
    ? usePost(updatedPostId)
    : { post: undefined, updatePostInList: undefined }

  const { control, handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      eventId,
      content: '',
      coverPhotoArray: updatedPostId
        ? post?.coverPhotoUrls.map((coverPhotoUrl) => ({
            type: 'url',
            url: coverPhotoUrl
          })) || []
        : undefined
    }
  })

  const content = useWatch({ control, name: 'content' })
  const coverPhotoArray = useWatch({ control, name: 'coverPhotoArray' })

  const isButtonDisabled = !content || coverPhotoArray?.length === 0

  useEffect(() => {
    if (updatedPostId && post) {
      setValue('content', post.content)
      setValue(
        'coverPhotoArray',
        post.coverPhotoUrls.map(
          (coverPhotoUrl) =>
            ({
              type: 'url',
              url: coverPhotoUrl
            }) as CoverPhotoData
        ) || []
      )
    } else {
      reset()
    }
  }, [post, updatedPostId, setValue])

  const { mutate: mutateCreatePost, isPending: isCreatingPostPending } = createPost({
    onSuccess: (data) => {
      toast.success(SUCCESS_MESSAGE.CREATE_EVENT_POST)
      addPost(data)
      setIsShowCreateOrUpdatePostPopup(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { mutate: mutateUpdatePost, isPending: isUpdatingPostPending } = updatePost(updatedPostId as number, {
    onSuccess: (data) => {
      toast.success(SUCCESS_MESSAGE.UPDATE_EVENT_POST)
      updatePostInList && updatePostInList(data)
      setIsShowCreateOrUpdatePostPopup(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    if (data.coverPhotoArray) {
      if (data.coverPhotoArray.length > 0) {
        const keepCoverPhotoUrls: string[] = []
        const newCoverPhotos: File[] = []
        data.coverPhotoArray.forEach((photo) => {
          if (photo.type === 'file') {
            newCoverPhotos.push(photo.file as File)
          } else {
            keepCoverPhotoUrls.push(photo.url as string)
          }
        })
        data.keepCoverPhotoUrls = keepCoverPhotoUrls
        data.coverPhotos = newCoverPhotos
      }
      delete data.coverPhotoArray
    }
    if (updatedPostId) {
      const postBody: Partial<PostBody> = {
        content: data.content,
        keepCoverPhotoUrls: data.keepCoverPhotoUrls,
        coverPhotos: data.coverPhotos
      }

      mutateUpdatePost(postBody)
    } else {
      const postBody: Partial<PostBody> = {
        eventId,
        content: data.content as string,
        coverPhotos: data.coverPhotos
      }
      mutateCreatePost(postBody)
    }
  })

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={() => setIsShowCreateOrUpdatePostPopup(false)}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>
            {updatedPostId ? 'Chỉnh sửa bài đăng' : 'Bài đăng mới'}
          </div>
          <div
            className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100'
            onClick={() => setIsShowCreateOrUpdatePostPopup(false)}
          >
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
              <img
                className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                src={event?.organizer.avatarUrl ?? DUTLogo}
                alt='dut-logo'
              />
            </div>
            <div className='block flex-1'>
              <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{event?.organizer.name}</div>
              <Input
                name='content'
                control={control}
                variant='textarea'
                placeholder='Bài đăng mới...'
                classNameWrapper='mt-1 w-full min-h-fit'
                classNameInput='mt-0 h-auto min-h-fit w-full resize-none overflow-hidden rounded-none border-none p-0 text-sm focus:outline-transparent'
                autoResize
              />
              <DraggableImages
                name='coverPhotoArray'
                control={control}
                showIsRequired={false}
                classNameWrapper='text-sm w-full flex-1'
              />
            </div>
          </div>
        </div>
        <div className='flex h-footer-popup items-center justify-between px-6 text-sm'>
          {event && (
            <div className='flex items-center gap-1 text-neutral-5'>
              <span className='min-w-fit'>Sự kiện:</span>
              <span className='line-clamp-1 font-semibold'>{event.name}</span>
            </div>
          )}
          <Button
            title='Đăng'
            type='submit'
            onClick={onSubmit}
            classButton='w-fit rounded-lg border-neutral-5 bg-neutral-0 px-4 py-[6px] text-base font-medium text-neutral-7 hover:border-neutral-5'
            classButtonDisabled='cursor-not-allowed opacity-40'
            disabled={isButtonDisabled || isCreatingPostPending || isUpdatingPostPending}
            classWrapperLoading={cn('', {
              block: isCreatingPostPending || isUpdatingPostPending
            })}
            classLoadingIndicator='text-neutral-7 fill-neutral-7'
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
