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
              'cursor-pointer py-2 focus:outline-none',
              index === activeIndex ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700',
              index === 0 ? 'ml-0' : 'ml-4'
            )}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </div>
        ))}
      </div>
      <div className='py-4'>{children[activeIndex]}</div>
    </div>
  )
}
