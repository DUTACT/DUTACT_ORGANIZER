import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from 'src/lib/tailwind/utils'
import LoadingIndicator from '../LoadingIndicator'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  classButton?: string
  classButtonDisabled?: string
  classTitle?: string
  classWrapperLoading?: string
  classLoadingIndicator?: string
  iconComponent?: ReactNode
}

export default function Button({
  title,
  type = 'button',
  disabled = false,
  classButton = '',
  classButtonDisabled = '',
  classTitle = '',
  classWrapperLoading = '',
  classLoadingIndicator = '',
  iconComponent,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 border border-transparent px-4 py-2 outline-none hover:outline-none focus:outline-none',
        classButton,
        disabled ? classButtonDisabled : ''
      )}
      disabled={disabled}
      {...rest}
    >
      <LoadingIndicator classWrapper={classWrapperLoading} classLoadingIndicator={classLoadingIndicator} />
      {iconComponent && iconComponent}
      <span className={cn('test-base font-medium', classTitle)}>{title}</span>
    </button>
  )
}
