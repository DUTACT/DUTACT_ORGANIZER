import { set } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { getSuggestedLocations } from 'src/apis/map'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { TIMEOUT } from 'src/constants/common'
import { cn } from 'src/lib/tailwind/utils'
import { GeoItem } from 'src/types/map.type'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

interface SearchLocationProps {
  onSelect: (item: GeoItem) => void
  onCancel: () => void
}

export default function SearchLocation({ onSelect, onCancel }: SearchLocationProps) {
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<GeoItem | null>({
    id: '12',
    title: '',
    position: { lat: 16.071743, lng: 108.152352 },
    scoring: 0
  })

  const { data, isLoading, error } = getSuggestedLocations({
    query: appliedQuery
  })

  useEffect(() => {
    if (!isSearching) {
      setIsSearching(true)
    }

    const timeout = setTimeout(() => {
      setAppliedQuery(query)
      setIsSearching(false)
    }, TIMEOUT.DEBOUNCE_LONG)

    return () => clearTimeout(timeout)
  }, [query])

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      onCancel()
    } else {
      onSelect(selectedLocation)
    }
  }

  const isTyping = (isSearching || isLoading) && query

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-2'>
        {error && <div>Error: {error.message}</div>}
        <div className='mt-3 flex items-center justify-between'>
          <Button
            className='bg-semantic-neutral/90 text-neutral-0 hover:bg-semantic-neutral'
            title='Hủy'
            onClick={onCancel}
          />
          <Button
            className='bg-semantic-secondary/90 text-neutral-0 hover:bg-semantic-secondary'
            title='Chọn'
            disabled={!selectedLocation}
            onClick={handleConfirmLocation}
          />
        </div>
      </div>

      {selectedLocation && (
        <MapContainer
          zoomControl={false}
          className='h-96 w-full'
          center={[selectedLocation.position.lat, selectedLocation.position.lng]}
          zoom={13}
        >
          <CustomControl>
            <div className='relative'>
              <Input
                classNameWrapper='flex'
                placeholder='Nhập địa chỉ hoặc tên địa điểm'
                className='mb-2'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className='absolute'>
                {isTyping && <div>Loading...</div>}
                {!isTyping && data && data?.length > 0 && (
                  <div className={cn('max-h-80 w-full overflow-y-auto border border-gray-300 bg-white')}>
                    {data?.map((item: GeoItem) => (
                      <div
                        key={item.id}
                        className='cursor-pointer p-2 hover:bg-gray-100'
                        onClick={() => setSelectedLocation(item)}
                      >
                        <div className='text-ellipsis'>{item.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CustomControl>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={[selectedLocation.position.lat, selectedLocation.position.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  )
}

const CustomControl = ({ children }: { children: React.ReactNode }) => {
  const controlRef = useRef(null)
  const map = useMap()

  useEffect(() => {
    const control = new L.Control({ position: 'topright' })

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'custom-control')
      div.innerHTML = ''
      div.appendChild(controlRef.current as unknown as Node)

      L.DomEvent.disableClickPropagation(div)
      L.DomEvent.on(div, 'mousedown', (e) => {
        L.DomEvent.stopPropagation(e)
      })
      L.DomEvent.on(div, 'mousewheel', (e) => {
        L.DomEvent.stopPropagation(e)
      })

      return div
    }

    control.addTo(map)

    return () => {
      control.remove()
    }
  }, [map])

  return <div ref={controlRef}>{children}</div>
}
