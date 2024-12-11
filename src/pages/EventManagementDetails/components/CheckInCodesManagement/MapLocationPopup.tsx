import { createPortal } from 'react-dom'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Divider from 'src/components/Divider'
import { CheckInCode } from 'src/types/checkInCode.type'
import { GeoPosition } from 'src/types/map.type'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface CreateCheckInCodePopup {
  checkInCode: CheckInCode
  onClose: () => void
}

export default function MapLocationPopup({ checkInCode, onClose }: CreateCheckInCodePopup) {
  const position: GeoPosition = checkInCode.location?.geoPosition || { lat: 0, lng: 0 }

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Địa chỉ check-in của mã {checkInCode.title}</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />

        <MapContainer className='h-96 w-full' center={[position.lat, position.lng]} zoom={17} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={[position.lat, position.lng]} icon={DefaultIcon} />
        </MapContainer>
      </div>
    </div>,
    document.body
  )
}
