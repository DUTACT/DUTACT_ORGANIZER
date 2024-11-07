import { useRef, useState, Fragment, useEffect } from 'react'
import { toast } from 'react-toastify'
import { CONFIG } from 'src/constants/config'
import ImageIcon from 'src/assets/icons/i-image.svg?react'
import CloseIcon from 'src/assets/icons/i-close-filled-primary.svg?react'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'
import { useController, type FieldPath, type FieldValues, UseControllerProps } from 'react-hook-form'

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
  initialImageUrl?: string
  removedInitialImage?: boolean
  setRemovedInitialImage?: (value: boolean) => void
}

export default function DraggableInputFile<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  labelName,
  showIsRequired,
  classNameWrapper,
  showError,
  rules,
  initialImageUrl,
  removedInitialImage = true,
  setRemovedInitialImage
}: Props<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error }
  } = useController({ control, name, rules })

  const [uploadedImage, setUploadedImage] = useState<string | null>(initialImageUrl ?? null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (fileFromLocal?: File) => {
    if (fileFromLocal) {
      if (fileFromLocal.size >= CONFIG.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image')) {
        toast.error('Dung lượng file tối đa 1 MB. Định dạng: .JPG, .JPEG, .PNG', {
          position: 'top-center'
        })
      } else {
        const fileURL = URL.createObjectURL(fileFromLocal)
        setUploadedImage(fileURL)
        if (setRemovedInitialImage) {
          setRemovedInitialImage(false)
        }
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
    const fileFromLocal = event.dataTransfer.files?.[0]
    handleFile(fileFromLocal)
    field.onChange(fileFromLocal)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.stopPropagation()
    setUploadedImage(null)
    field.onChange(undefined)
    if (setRemovedInitialImage) {
      setRemovedInitialImage(true)
    }
  }

  useEffect(() => {
    if (initialImageUrl) {
      setUploadedImage(initialImageUrl)
      if (setRemovedInitialImage) {
        setRemovedInitialImage(false)
      }
    } else {
      setUploadedImage(null)
      if (setRemovedInitialImage) {
        setRemovedInitialImage(true)
      }
    }
  }, [initialImageUrl])

  return (
    <FormFieldWrapper
      classNameWrapper={classNameWrapper}
      labelName={labelName}
      showIsRequired={showIsRequired}
      showError={removedInitialImage && showError}
      errorMessage={removedInitialImage ? error?.message : undefined}
    >
      <input
        ref={fileInputRef}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={(event) => {
          const fileFromLocal = event.target.files?.[0]
          handleFile(fileFromLocal)
          field.onChange(fileFromLocal)
          {
            setRemovedInitialImage && setRemovedInitialImage(true)
          }
        }}
      />
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1 rounded-md text-sm font-medium text-neutral-7 transition-opacity duration-200',
          {
            'opacity-50': isDragging,
            'opacity-100': !isDragging,
            'w-full cursor-pointer border-2 border-dashed border-gray-300 py-4': !uploadedImage
          }
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUpload}
      >
        {!uploadedImage ? (
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
            <div className='relative mt-2 w-full'>
              <div className='aspect-h-9 aspect-w-16 relative block min-h-[50px] w-full min-w-full overflow-hidden rounded-md border-[1px] border-neutral-4'>
                <img
                  src={uploadedImage}
                  alt='Uploaded image'
                  className='absolute left-0 top-0 mx-auto h-full w-full object-contain'
                />
              </div>
              <div
                className='absolute right-[5px] top-[5px] flex cursor-pointer items-center justify-center rounded-full bg-neutral-0 p-1 opacity-50 hover:opacity-100'
                onClick={handleRemoveFile}
              >
                <CloseIcon className='h-[20px] w-[20px]' />
              </div>
            </div>

            <div
              className='test-base w-full cursor-pointer py-2 text-center font-medium text-semantic-secondary/80 hover:text-semantic-secondary'
              onClick={handleUpload}
            >
              Chọn ảnh khác
            </div>
          </Fragment>
        )}
      </div>
    </FormFieldWrapper>
  )
}
