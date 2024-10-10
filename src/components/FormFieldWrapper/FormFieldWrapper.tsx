import { ReactNode } from 'react'
import { cn } from 'src/lib/tailwind/utils'

interface FormFieldWrapperProps {
  labelName?: string
  classNameWrapper?: string
  classNameLabel?: string
  classNameError?: string
  classNameRequired?: string
  errorMessage?: string
  showIsRequired?: boolean
  showError?: boolean
  children: ReactNode
}

export default function FormFieldWrapper({
  labelName,
  classNameWrapper = '',
  classNameLabel = '',
  classNameError = '',
  classNameRequired = '',
  errorMessage,
  showIsRequired = false,
  showError = true,
  children
}: FormFieldWrapperProps) {
  return (
    <div className={cn('mt-2', classNameWrapper)}>
      {labelName && (
        <div className={cn('text-sm font-semibold tracking-wide text-neutral-8', classNameLabel)}>
          {labelName}
          {showIsRequired && <span className={cn('ml-1 text-semantic-cancelled', classNameRequired)}>*</span>}
        </div>
      )}
      {children}
      {showError && (
        <div className={cn('mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled', classNameError)}>
          {errorMessage}
        </div>
      )}
    </div>
  )
}
