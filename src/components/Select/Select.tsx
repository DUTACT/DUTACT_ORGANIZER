import { SelectHTMLAttributes, useEffect, useState } from 'react'
import { useController, type FieldPath, type FieldValues, type UseControllerProps } from 'react-hook-form'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'
import { OptionSelect } from 'src/types/common.type'
import ChevronDownIcon from 'src/assets/icons/i-chevron-down.svg?react'

export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameWrapper?: string
  classNameLabel?: string
  classNameSelect?: string
  classNameOption?: string
  classNameError?: string
  classNameRequired?: string
  className?: string
  labelName?: string
  showIsRequired?: boolean
  showError?: boolean
  name?: FieldPath<TFieldValues>
  options: OptionSelect[]
  placeholder?: string
} & SelectHTMLAttributes<HTMLSelectElement> &
  Partial<UseControllerProps<TFieldValues, TName>>

export default function Select<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Props<TFieldValues, TName>) {
  const {
    onChange,
    labelName,
    showIsRequired,
    classNameWrapper,
    classNameSelect = '',
    classNameOption = '',
    classNameError,
    showError,
    value,
    control,
    name,
    rules,
    options,
    placeholder = '',
    ...rest
  } = props

  const hasController = control && name
  const {
    field,
    fieldState: { error }
  } = hasController
    ? useController({ control, name, rules })
    : {
        field: {
          value: value?.toString() || ''
        },
        fieldState: { error: undefined }
      }

  const [localValue, setLocalValue] = useState<string>(field.value || '')

  useEffect(() => {
    if (hasController) {
      setLocalValue(field.value || '')
    }
  }, [field.value, hasController])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valueFromInput = event.target.value
    setLocalValue(valueFromInput)

    if ('onChange' in field && typeof field.onChange === 'function') {
      field.onChange(valueFromInput)
    }
    if (onChange && typeof onChange === 'function') {
      onChange(event as any)
    }
  }

  return (
    <FormFieldWrapper
      labelName={labelName}
      showIsRequired={showIsRequired}
      classNameWrapper={classNameWrapper}
      showError={showError}
      errorMessage={error?.message}
      {...rest}
    >
      <div className='relative mt-1'>
        <select
          className={cn(
            'w-full appearance-none rounded-md border-[1px] border-neutral-3 bg-neutral-1 px-4 py-2 focus:outline-primary',
            classNameSelect
          )}
          {...rest}
          {...(hasController ? field : {})}
          onChange={handleChange}
          value={localValue}
        >
          {placeholder && (
            <option key='' value='' disabled className={cn('bg-neutral-0 text-sm', classNameOption)}>
              {placeholder}
            </option>
          )}
          {options &&
            options.map(({ label, value }) => (
              <option key={value} value={value} className={cn('bg-neutral-0 text-sm', classNameOption)}>
                {label}
              </option>
            ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
          <ChevronDownIcon className='h-[16px] w-[16px]' />
        </div>
      </div>
    </FormFieldWrapper>
  )
}
