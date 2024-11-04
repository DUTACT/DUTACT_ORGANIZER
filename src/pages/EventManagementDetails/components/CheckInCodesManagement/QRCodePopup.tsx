import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import DownloadIcon from 'src/assets/icons/i-download.svg?react'
import Divider from 'src/components/Divider'
import Button from 'src/components/Button'
import { CheckInCode } from 'src/types/checkInCode.type'
import { QRCodeCanvas } from 'qrcode.react'
import { useRef } from 'react'

interface CreateCheckInCodePopup {
  checkInCode: CheckInCode
  onClose: () => void
}

export default function QRCodePopup({ checkInCode, onClose }: CreateCheckInCodePopup) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDownloadQRCode = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${checkInCode.title}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={onClose}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Mã QR cho {checkInCode.title}</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start justify-center gap-2'>
            <QRCodeCanvas marginSize={1} ref={canvasRef} value={checkInCode.id} size={256} />
          </div>
        </div>
        <div className='flex h-footer-popup items-center justify-between px-6 text-sm'>
          <Button
            title='Tải mã QR'
            iconComponent={<DownloadIcon className='h-[20px] w-[20px] text-base' />}
            type='submit'
            classButton='text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md'
            classButtonDisabled='cursor-not-allowed opacity-40'
            classLoadingIndicator='text-neutral-7 fill-neutral-7'
            onClick={handleDownloadQRCode}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
