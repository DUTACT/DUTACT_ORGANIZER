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
          'w-full  gap-1 rounded-md flex flex-col items-center text-sm text-neutral-7 font-medium justify-center  transition-opacity duration-200',
          {
            'opacity-50': isDragging,
            'opacity-100': !isDragging,
            'py-4 border-2 w-full border-dashed border-gray-300 cursor-pointer': !uploadedImage
          }
        )}
      >
        {!uploadedImage && (
          <div
            className='flex items-center justify-center flex-col flex-1 w-full h-full'
            onClick={handleUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className='w-logo-md h-logo-md' />
            <p className='mt-2'>Kéo và thả ảnh vào đây</p>
            <p>
              hoặc <span className='text-primary/80 hover:text-primary'>tải ảnh lên</span>
            </p>
            <p className='text-xs font-normal text-neutral-5 mt-2'>Tệp hỗ trợ: .JPG, .JPEG, .PNG</p>
          </div>
        )}

        {uploadedImage && (
          <Fragment>
            <div className='mt-2 w-full relative'>
              <div className='block w-full border-[1px] border-neutral-4 overflow-hidden min-w-full min-h-[50px] aspect-w-16 aspect-h-9 relative rounded-md'>
                <img
                  src={uploadedImage}
                  alt='Uploaded image'
                  className='w-full h-full absolute mx-auto left-0 top-0 object-contain'
                />
              </div>
              <div
                className='bg-neutral-0 flex items-center justify-center rounded-full absolute top-[5px] right-[5px] opacity-50 cursor-pointer hover:opacity-100 p-1'
                onClick={handleRemoveFile}
              >
                <CloseIcon className='w-[20px] h-[20px]' />
              </div>
            </div>

            <div
              className='text-semantic-secondary/80 hover:text-semantic-secondary font-medium w-full py-2 cursor-pointer text-center text-md'
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
