import { InputHTMLAttributes } from 'react'
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'

interface Props<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  classNameWrapper?: string
  classNameLabel?: string
  classNameInput?: string
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

export default function Input<TFieldValues extends FieldValues = FieldValues>({
  classNameInput = '',
  name,
  register,
  rules,
  ...rest
}: Props<TFieldValues>) {
  const registerResult = register && name ? register(name, rules) : null

  return (
    <FormFieldWrapper {...rest}>
      <input
        className={cn(
          'mt-1 w-full rounded-md border-[1px] border-neutral-3 bg-neutral-1 px-4 py-2 focus:outline-primary',
          classNameInput
        )}
        {...registerResult}
        {...rest}
      />
    </FormFieldWrapper>
  )
}
