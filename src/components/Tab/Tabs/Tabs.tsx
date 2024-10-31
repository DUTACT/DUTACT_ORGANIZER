import { useState } from 'react'
import { TabProps } from '../Tab/Tab'
import { cn } from 'src/lib/tailwind/utils'
interface TabsProps {
  children: React.ReactElement<TabProps>[]
}

export default function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div className='flex border-b border-gray-300'>
        {children.map((tab, index) => (
          <div
            key={index}
            className={cn(
              'cursor-pointer px-4 py-2 focus:outline-none',
              index === activeIndex ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </div>
        ))}
      </div>
      <div className='p-4'>{children[activeIndex]}</div>
    </div>
  )
}
