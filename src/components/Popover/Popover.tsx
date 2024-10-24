interface Props {
  isOpen: boolean
  content: JSX.Element
  children: JSX.Element
}

export default function Popover({ isOpen, content, children }: Props) {
  return (
    <div>
      {children}
      {isOpen && content}
    </div>
  )
}
