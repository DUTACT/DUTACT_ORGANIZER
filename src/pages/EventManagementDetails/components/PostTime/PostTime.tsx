import { useState, useEffect } from 'react'
import { timeAgo } from 'src/utils/datetime'

interface PostTimeProps {
  postedAt: string
}

export default function PostTime({ postedAt }: PostTimeProps) {
  const [timeAgoText, setTimeAgoText] = useState(timeAgo(postedAt))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeAgoText(timeAgo(postedAt))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [postedAt])

  return <div className='mt-[2px] line-clamp-1 text-xs font-normal text-neutral-6'>{timeAgoText}</div>
}
