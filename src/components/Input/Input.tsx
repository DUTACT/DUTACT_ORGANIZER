import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { cn } from 'src/lib/tailwind/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  classNameLabel?: string
  classNameInput?: string
  classNameError?: string
  classNameRequired?: string
  labelName?: string
  errorMessage?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  showIsRequired?: boolean
}

export default function Input({
  className = '',
  classNameLabel = '',
  classNameInput = '',
  classNameError = '',
  classNameRequired = '',
  name,
  register,
  rules,
  labelName,
  errorMessage,
  showIsRequired = false,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div className='mt-2'>
      <div className={cn('text-sm font-semibold tracking-wide text-neutral-8', classNameLabel)}>
        {labelName}
        <span
          className={cn('ml-1 text-semantic-cancelled', classNameRequired, {
            hidden: !showIsRequired
          })}
        >
          *
        </span>
      </div>
      <input
        className={cn(
          'mt-1 w-full rounded-md border-[1px] border-neutral-3 bg-neutral-1 px-4 py-2 focus:outline-primary',
          classNameInput
        )}
        {...registerResult}
        {...rest}
      />
      <div className={cn('mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled', classNameError)}>
        {errorMessage}
      </div>
    </div>
  )
}
