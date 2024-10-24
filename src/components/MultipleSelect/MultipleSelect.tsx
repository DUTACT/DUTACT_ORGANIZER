import React, { useEffect, useState } from 'react'
import { useController, type FieldPath, type FieldValues, type UseControllerProps } from 'react-hook-form'
import FormFieldWrapper from 'src/components/FormFieldWrapper'
import { cn } from 'src/lib/tailwind/utils'

export type Option = {
  label: string
  value: string
}

export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameWrapper?: string
  classNameLabel?: string
  classNameSelect?: string
  classNameError?: string
  classNameRequired?: string
  labelName?: string
  showIsRequired?: boolean
  showError?: boolean
  name?: FieldPath<TFieldValues>
  options: Option[]
} & Partial<UseControllerProps<TFieldValues, TName>>

export default function BaseMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Props<TFieldValues, TName>) {
  const {
    labelName,
    showIsRequired,
    classNameWrapper,
    classNameSelect = '',
    classNameError,
    showError,
    control,
    name,
    options,
    rules,
    ...rest
  } = props

  const hasController = control && name
  const {
    field,
    fieldState: { error }
  } = hasController ? useController({ control, name, rules }) : { field: {}, fieldState: {} }

  const [localValue, setLocalValue] = useState<string[]>(field.value || [])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (hasController) {
      setLocalValue(field.value || [])
    }
  }, [field.value, hasController])

  const handleSelect = (optionValue: string) => {
    setLocalValue((prev) => {
      const newValue = prev.includes(optionValue)
        ? prev.filter((value) => value !== optionValue) // Remove if already selected
        : [...prev, optionValue] // Add if not selected
      if ('onChange' in field && typeof field.onChange === 'function') {
        field.onChange(newValue)
      }
      return newValue
    })
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
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
      <div className={cn('relative w-[300px] max-w-[300px]', classNameSelect)}>
        <div
          className={cn('flex cursor-pointer flex-wrap gap-y-1 rounded-md border bg-neutral-1 p-2')}
          onClick={toggleDropdown}
        >
          {localValue.length > 0 ? (
            localValue.map((value) => (
              <div key={value} className='mr-2 rounded-full bg-blue-200 px-2 py-1 text-sm'>
                {options.find((option) => option.value === value)?.label || value}
              </div>
            ))
          ) : (
            <span className='text-gray-400'>Chọn các tổ chức</span>
          )}
        </div>

        {isOpen && (
          <div className='absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg'>
            {options.map((option) => (
              <div
                key={option.value}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${localValue.includes(option.value) ? 'bg-gray-100' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  )
}
