import { useRef, useState, Fragment, useEffect } from 'react'
import { toast } from 'react-toastify'
import { CONFIG } from 'src/constants/config'
import ImageIcon from 'src/assets/icons/i-image.svg?react'
import CloseIcon from 'src/assets/icons/i-close-filled-primary.svg?react'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'
import { useController, type FieldPath, type FieldValues, UseControllerProps } from 'react-hook-form'
import ShowIcon from 'src/assets/icons/i-show.svg?react'
import AddImageIcon from 'src/assets/icons/i-add-image.svg?react'
import { CoverPhotoData } from 'src/types/post.type'
import ImageListPopup from '../ImageListPopup'
import ImageSlider from '../ImageSlider'

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: UseControllerProps<TFieldValues, TName>['control']
  name: TName
  labelName?: string
  showIsRequired?: boolean
  classNameWrapper?: string
  classNameError?: string
  showError?: boolean
  rules?: any
  initialImageUrls?: string[]
}
export default function DraggableImages<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name, labelName, showIsRequired, classNameWrapper, rules }: Props<TFieldValues, TName>) {
  const { field } = useController({ control, name, rules })
  const [uploadedImages, setUploadedImages] = useState<CoverPhotoData[]>(() => {
    return field.value?.length ? field.value : []
  })

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isShowImageListPopup, setIsShowImageListPopup] = useState<boolean>(false)
  const [isShowImageSlider, setIsShowImageSlider] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setUploadedImages(field.value?.length ? field.value : [])
  }, [field])

  const handleFile = (fileFromLocal?: File) => {
    if (fileFromLocal) {
      if (fileFromLocal.size >= CONFIG.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image')) {
        toast.error('Dung lượng file tối đa 1 MB. Định dạng: .JPG, .JPEG, .PNG', {
          position: 'top-center'
        })
      } else {
        const fileURL = URL.createObjectURL(fileFromLocal)
        console.error('handleFile')
        setUploadedImages((prev) => [...prev, { type: 'file', file: fileFromLocal, url: fileURL }])
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    Array.from(event.dataTransfer.files).forEach((file) => handleFile(file))
    field.onChange(uploadedImages)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveFile = (index: number) => {
    console.error('handleRemoveFile')

    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    const updatedImages = uploadedImages.filter((_, i) => i !== index)
    field.onChange(updatedImages)
  }

  const handleShowImageSlider = (image: string) => {
    setSelectedImage(image)
    setIsShowImageSlider(true)
  }

  return (
    <FormFieldWrapper classNameWrapper={classNameWrapper} labelName={labelName} showIsRequired={showIsRequired}>
      <input
        ref={fileInputRef}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        multiple
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          files.forEach((file) => handleFile(file))
          field.onChange([
            ...uploadedImages,
            ...files.map((file) => ({ type: 'file', file: file, url: URL.createObjectURL(file) }))
          ])
        }}
      />
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1 rounded-md text-sm font-medium text-neutral-7 transition-opacity duration-200',
          {
            'opacity-50': isDragging,
            'opacity-100': !isDragging,
            'w-full cursor-pointer border-2 border-dashed border-gray-300 py-4': uploadedImages.length === 0
          }
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUpload}
      >
        {uploadedImages.length === 0 ? (
          <Fragment>
            <ImageIcon className='h-logo-md w-logo-md' />
            <p className='mt-2'>Kéo và thả ảnh vào đây</p>
            <p>
              hoặc <span className='text-primary/80 hover:text-primary'>tải ảnh lên</span>
            </p>
            <p className='mt-2 text-xs font-normal text-neutral-5'>Tệp hỗ trợ: .JPG, .JPEG, .PNG</p>
            <p className='text-xs font-normal text-neutral-5'>Kích thước file: &lt; 5MB</p>
          </Fragment>
        ) : (
          <Fragment>
            <div
              className='relative block w-full rounded-lg border border-neutral-4 p-1'
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div className='flex w-full flex-col gap-[2px] overflow-hidden rounded-md'>
                <div className='block w-full'>
                  <div className='flex w-full flex-row gap-[2px]'>
                    {(uploadedImages.length <= 3 ? uploadedImages : uploadedImages.slice(0, 2)).map((image, index) => (
                      <div
                        key={index}
                        className='relative block w-full hover:cursor-pointer'
                        onClick={() => handleShowImageSlider(image.url as string)}
                      >
                        <div className='aspect-h-9 aspect-w-16 relative block min-h-[150px] w-full overflow-hidden'>
                          <img
                            src={image.url as string}
                            alt={`Uploaded image ${index + 1}`}
                            className='absolute left-0 top-0 mx-auto h-full w-full object-cover'
                          />
                        </div>
                        {uploadedImages.length <= 5 && (
                          <div
                            className='absolute right-[5px] top-[5px] z-20 flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-neutral-0 p-1 opacity-50 hover:opacity-100'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFile(index)
                            }}
                          >
                            <CloseIcon className='h-[20px] w-[20px]' />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='block w-full'>
                  <div className='flex w-full flex-row gap-[2px]'>
                    {uploadedImages.length >= 4 &&
                      uploadedImages.slice(2, 5).map((image, index) => (
                        <div
                          key={index}
                          className='relative block w-full hover:cursor-pointer'
                          onClick={() => handleShowImageSlider(image.url as string)}
                        >
                          <div className='aspect-h-9 aspect-w-16 relative block min-h-[150px] w-full overflow-hidden'>
                            <img
                              src={image.url as string}
                              alt={`Uploaded image ${index + 1}`}
                              className='absolute left-0 top-0 mx-auto h-full w-full object-cover'
                            />
                          </div>
                          {uploadedImages.length <= 5 && (
                            <div
                              className='absolute right-[5px] top-[5px] z-20 flex h-fit w-fit cursor-pointer items-center justify-center rounded-full bg-neutral-0 p-1 opacity-50 hover:opacity-100'
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveFile(index)
                              }}
                            >
                              <CloseIcon className='h-[20px] w-[20px]' />
                            </div>
                          )}
                          {uploadedImages.length > 5 && index === 2 && (
                            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-neutral-6/60 text-4xl font-medium tracking-wider text-neutral-3'>
                              +{uploadedImages.length - 5}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className='absolute left-3 top-3 z-50 flex gap-2'>
                {uploadedImages.length > 5 && (
                  <div
                    className='flex w-fit items-center gap-1 rounded-md bg-neutral-0 px-2 py-1 shadow-custom hover:cursor-pointer hover:bg-neutral-2'
                    onClick={() => setIsShowImageListPopup(true)}
                  >
                    <ShowIcon className='h-[16px] w-[16px]' />
                    <span className='text-base font-medium text-neutral-7'>Xem tất cả</span>
                  </div>
                )}
                <div
                  className='flex w-fit items-center gap-1 rounded-md bg-neutral-0 px-2 py-1 shadow-custom hover:cursor-pointer hover:bg-neutral-2'
                  onClick={handleUpload}
                >
                  <AddImageIcon className='h-[16px] w-[16px]' />
                  <span className='text-base font-medium text-neutral-7'>Thêm ảnh mới</span>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
      {isShowImageListPopup && (
        <ImageListPopup
          coverPhotos={uploadedImages}
          onClose={() => setIsShowImageListPopup(false)}
          onRemoveFile={handleRemoveFile}
        />
      )}
      {isShowImageSlider && (
        <ImageSlider
          imageList={uploadedImages.map((image) => image.url as string)}
          currentImage={selectedImage}
          onClose={() => setIsShowImageSlider(false)}
        />
      )}
    </FormFieldWrapper>
  )
}
