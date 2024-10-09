import { TextareaHTMLAttributes } from 'react'
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'

interface Props<TFieldValues extends FieldValues> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  classNameWrapper?: string
  classNameLabel?: string
  classNameTextArea?: string
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

export default function TextArea<TFieldValues extends FieldValues = FieldValues>({
  classNameTextArea = '',
  name,
  register,
  rules,
  ...rest
}: Props<TFieldValues>) {
  const registerResult = register && name ? register(name, rules) : null

  return (
    <FormFieldWrapper {...rest}>
      <textarea
        className={cn(
          'mt-1 w-full rounded-md border-[1px] border-neutral-3 bg-neutral-1 px-4 py-2 focus:outline-primary',
          classNameTextArea
        )}
        {...registerResult}
        {...rest}
      />
    </FormFieldWrapper>
  )
}
