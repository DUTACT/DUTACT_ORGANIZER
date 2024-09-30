import { ButtonHTMLAttributes } from 'react'
import { cn } from 'src/lib/tailwind/utils'
import LoadingIndicator from '../LoadingIndicator'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  classButton?: string
  classTitle?: string
  classLoadingIndicator?: string
  href?: string
}

export default function Button({
  title,
  type = 'button',
  disabled = false,
  classButton = '',
  classTitle = '',
  classLoadingIndicator = '',
  href = '',
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 border-none px-4 py-2 outline-none hover:outline-none focus:outline-none',
        classButton
      )}
      disabled={disabled}
      {...rest}
    >
      <LoadingIndicator classWrapper={classLoadingIndicator} />
      <span className={cn('text-md font-medium', classTitle)}>{title}</span>
    </button>
  )
}
