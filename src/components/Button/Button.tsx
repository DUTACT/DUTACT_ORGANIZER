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
  semantic?: 'secondary' | 'cancelled' | 'success'
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
  semantic,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 border border-transparent px-4 py-2 outline-none hover:outline-none focus:outline-none',
        classButton,
        disabled ? classButtonDisabled : '',
        semantic === 'secondary'
          ? 'bg-semantic-secondary text-neutral-0 hover:bg-semantic-secondary/90'
          : semantic === 'cancelled'
            ? 'bg-semantic-cancelled text-neutral-0 hover:bg-semantic-cancelled/90'
            : semantic === 'success'
              ? 'bg-semantic-success text-neutral-0 hover:bg-semantic-success/90'
              : ''
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
