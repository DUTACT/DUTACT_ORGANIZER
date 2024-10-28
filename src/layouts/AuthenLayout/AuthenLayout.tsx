import { useEffect, useState } from 'react'
import DUTBackground from 'src/assets/img/dut-background.jpg'
import DutactLogo from 'src/assets/img/dutact-logo.png'
import DUTLogo from 'src/assets/img/dut-logo.jpg'

interface Props {
  children?: React.ReactNode
}

export default function AuthenLayout({ children }: Props) {
  const [isHiddenImage, setIsHiddenImage] = useState<boolean>(false)

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 938) {
        setIsHiddenImage(true)
      } else {
        setIsHiddenImage(false)
      }
    }
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)
    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [])

  return (
    <div className='flex h-[100vh] w-[100vw] items-center justify-center gap-4 bg-white px-10 py-6'>
      <div className='flex h-full w-full min-w-[500px] max-w-[600px] flex-col'>
        <div className='ml-[-12px] flex items-center gap-2'>
          <img src={DutactLogo} alt='dutact-logo' className='h-[40px] w-[40px]' />
          <div className='text-xl font-semibold tracking-wide'>Dutact.</div>
        </div>
        <div className='flex flex-1 items-center justify-center px-16'>{children}</div>
        <div className='flex min-h-[40px] items-end gap-2'>
          <img src={DUTLogo} alt='dut-logo' className='h-[30px] w-[30px]' />
          <div className='flex flex-col justify-center gap-0'>
            <div className='text-[10px] font-normal leading-[13px] text-neutral-6'>Website thuộc về</div>
            <div className='text-[12px] font-medium leading-[16px] text-neutral-7'>
              Trường Đại học Bách khoa Đà Nẵng
            </div>
          </div>
        </div>
      </div>
      {!isHiddenImage && (
        <div className='h-full w-full min-w-[400px] max-w-[600px]'>
          <img src={DUTBackground} alt='dut-background' className='h-full w-full rounded-3xl object-cover' />
        </div>
      )}
    </div>
  )
}
