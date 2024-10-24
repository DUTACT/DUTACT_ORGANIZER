import Popover from 'src/components/Popover'
import { usePopper } from 'react-popper'
import { ReactNode, useState } from 'react'
import FilterIcon from 'src/assets/icons/i-filter.svg?react'

interface Props {
  content: (onClosePopover: () => void) => ReactNode
}

export default function FilterPopover({ content }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
  })

  const onClosePopover = () => {
    setIsPopoverOpen(false)
    setReferenceElement(null)
    setPopperElement(null)
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      content={
        <div
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 9999 }}
          {...attributes.popper}
          className='rounded-md border border-neutral-4 bg-white p-4 shadow-lg'
        >
          {content(onClosePopover)}
        </div>
      }
    >
      <div
        ref={setReferenceElement}
        className='flex cursor-pointer items-center gap-2 rounded-md border border-neutral-4 px-4 py-2'
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        <FilterIcon className='h-[20px] w-[20px]' />
        <span className='text-sm font-medium text-neutral-7'>Bộ lọc</span>
      </div>
    </Popover>
  )
}
