import { createPortal } from 'react-dom'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import { EventOfOrganizer } from 'src/types/event.type'
import PostTime from '../PostTime'
import { Feedback } from 'src/types/feedback.type'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import ImageSlider from 'src/components/ImageSlider'
import { useState } from 'react'

interface FeedbackDetailPopupProps {
  onClose: () => void
  event: EventOfOrganizer
  feedback: Feedback
}

export default function FeedbackDetailsPopup({ event, feedback, onClose }: FeedbackDetailPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isShowImageSlider, setIsShowImageSlider] = useState<boolean>(false)

  const handleShowImageSlider = (image: string) => {
    setSelectedImage(image)
    setIsShowImageSlider(true)
  }

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={onClose}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
              <img
                className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                src={feedback.studentAvatarUrl ?? DUTLogo}
                alt='dut-logo'
              />
            </div>
            <div className='block flex-1'>
              <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{feedback.studentName}</div>
              <PostTime postedAt={moment(feedback.postedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)} />
              <div className='mt-3 whitespace-pre-wrap text-sm font-normal text-neutral-7'>{feedback.content}</div>
              {feedback.coverPhotoUrls.length > 0 && (
                <div
                  className='relative block w-full rounded-lg border border-neutral-4 p-1'
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <div className='flex w-full flex-col gap-[2px] overflow-hidden rounded-md'>
                    <div className='block w-full'>
                      <div className='flex w-full flex-row gap-[2px]'>
                        {(feedback.coverPhotoUrls.length <= 3
                          ? feedback.coverPhotoUrls
                          : feedback.coverPhotoUrls.slice(0, 2)
                        ).map((image, index) => (
                          <div
                            key={index}
                            className='relative block w-full hover:cursor-pointer'
                            onClick={() => handleShowImageSlider(image)}
                          >
                            <div className='aspect-h-9 aspect-w-16 relative block min-h-[150px] w-full overflow-hidden'>
                              <img
                                src={image}
                                alt={`Uploaded image ${index + 1}`}
                                className='absolute left-0 top-0 mx-auto h-full w-full object-cover'
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {feedback.coverPhotoUrls.length >= 4 && (
                      <div className='block w-full'>
                        <div className='flex w-full flex-row gap-[2px]'>
                          {feedback.coverPhotoUrls.slice(2, 5).map((image, index) => (
                            <div
                              key={index}
                              className='relative block w-full hover:cursor-pointer'
                              onClick={() => handleShowImageSlider(image)}
                            >
                              <div className='aspect-h-9 aspect-w-16 relative block min-h-[150px] w-full overflow-hidden'>
                                <img
                                  src={image}
                                  alt={`Uploaded image ${index + 1}`}
                                  className='absolute left-0 top-0 mx-auto h-full w-full object-cover'
                                />
                              </div>
                              {feedback.coverPhotoUrls.length > 5 && index === 2 && (
                                <div
                                  className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-neutral-6/60 text-4xl font-medium tracking-wider text-neutral-3 hover:cursor-pointer'
                                  onClick={() => handleShowImageSlider(image)}
                                >
                                  +{feedback.coverPhotoUrls.length - 5}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
        </div>
      </div>
      {isShowImageSlider && (
        <ImageSlider
          imageList={feedback.coverPhotoUrls}
          currentImage={selectedImage}
          onClose={() => setIsShowImageSlider(false)}
        />
      )}
    </div>,
    document.body
  )
}
