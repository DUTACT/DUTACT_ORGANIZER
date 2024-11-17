import { useEffect, useRef } from 'react'

interface Props {
  isOpen: boolean
  content: JSX.Element
  children: JSX.Element
  containerClass?: string
  onClose?: () => void
}

export default function Popover({ isOpen, content, children, containerClass, onClose }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose && onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div className={containerClass}>
      {children}
      {isOpen && <div ref={popoverRef}>{content}</div>}
    </div>
  )
}
