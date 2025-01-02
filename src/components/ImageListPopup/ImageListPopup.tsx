import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Divider from 'src/components/Divider'
import { CoverPhotoData } from 'src/types/post.type'
import ImageSlider from '../ImageSlider'
import { useState } from 'react'

interface ImageListPopupProps {
  coverPhotos: CoverPhotoData[]
  onClose: () => void
  onRemoveFile: (_index: number) => void
}

export default function ImageListPopup({ coverPhotos, onClose, onRemoveFile }: ImageListPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isShowImageSlider, setIsShowImageSlider] = useState<boolean>(false)

  if (coverPhotos.length === 0) {
    onClose()
  }

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-20 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div className='h-fit max-h-popup w-[800px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'>
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Các ảnh đã chọn</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='grid max-h-main-popup grid-cols-3 gap-2 overflow-auto p-4'>
          {coverPhotos.map((coverPhoto, index) => (
            <div
              key={index}
              className='relative block w-full overflow-hidden rounded-lg shadow-custom hover:cursor-pointer'
              onClick={() => {
                setSelectedImage(coverPhoto.url as string)
                setIsShowImageSlider(true)
              }}
            >
              <div className='aspect-h-9 aspect-w-16 relative block min-h-[150px] w-full overflow-hidden'>
                <img
                  src={coverPhoto.url as string}
                  alt={`Uploaded image ${index + 1}`}
                  className='absolute left-0 top-0 mx-auto h-full w-full object-cover'
                />
              </div>

              <div
                className='absolute right-[5px] top-[5px] z-20 flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-neutral-0 p-1 opacity-50 hover:opacity-100'
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFile(index)
                }}
              >
                <CloseIcon className='h-[20px] w-[20px]' />
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className='flex h-footer-popup items-center justify-between px-6 text-sm'>
          <div className='flex items-center gap-1 text-neutral-5'>
            <span className='line-clamp-1 font-semibold'>Đã chọn {coverPhotos.length} ảnh</span>
          </div>
        </div>
      </div>
      {isShowImageSlider && (
        <ImageSlider
          imageList={coverPhotos.map((photo) => photo.url as string)}
          currentImage={selectedImage}
          onClose={() => setIsShowImageSlider(false)}
        />
      )}
    </div>,
    document.body
  )
}
