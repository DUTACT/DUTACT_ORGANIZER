import { useRef, useState, useEffect, Fragment } from 'react'
import { toast } from 'react-toastify'
import { CONFIG } from 'src/constants/config'
import ImageIcon from 'src/assets/icons/i-image.svg?react'
import CloseIcon from 'src/assets/icons/i-close-filled-primary.svg?react'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { cn } from 'src/lib/tailwind/utils'

interface Props<TFieldValues extends FieldValues> {
  onChange?: (file?: File) => void
  classNameWrapper?: string
  classNameLabel?: string
  classNameError?: string
  classNameRequired?: string
  labelName?: string
  errorMessage?: string
  register?: UseFormRegister<TFieldValues>
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  name?: FieldPath<TFieldValues>
  showIsRequired?: boolean
  showError?: boolean
}

export default function DraggableInputFile<TFieldValues extends FieldValues = FieldValues>({
  onChange,
  register,
  rules,
  name,
  showIsRequired,
  ...rest
}: Props<TFieldValues>) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    handleFile(fileFromLocal)

    if (onChange) {
      onChange(fileFromLocal)
    }
  }

  const handleFile = (fileFromLocal?: File) => {
    if (fileFromLocal) {
      if (fileFromLocal.size >= CONFIG.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image')) {
        toast.error('Dung lượng file tối đa 5 MB. Định dạng: .JPG, .JPEG, .PNG', {
          position: 'top-center'
        })
      } else {
        const fileURL = URL.createObjectURL(fileFromLocal)
        setUploadedImage(fileURL)
      }
    }

    fileInputRef.current!.value = ''
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const fileFromLocal = event.dataTransfer.files?.[0]
    handleFile(fileFromLocal)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveFile = () => {
    setUploadedImage(null)
    onChange?.(undefined)
  }

  useEffect(() => {
    if (register && name) {
      register(name, { ...rules })
    }
  }, [register, name, rules])

  return (
    <FormFieldWrapper {...rest}>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={handleInputClick}
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
      >
        {!uploadedImage && (
          <div
            className='flex h-full w-full flex-1 flex-col items-center justify-center'
            onClick={handleUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className='h-logo-md w-logo-md' />
            <p className='mt-2'>Kéo và thả ảnh vào đây</p>
            <p>
              hoặc <span className='text-primary/80 hover:text-primary'>tải ảnh lên</span>
            </p>
            <p className='mt-2 text-xs font-normal text-neutral-5'>Tệp hỗ trợ: .JPG, .JPEG, .PNG</p>
          </div>
        )}

        {uploadedImage && (
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
              className='text-md w-full cursor-pointer py-2 text-center font-medium text-semantic-secondary/80 hover:text-semantic-secondary'
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
