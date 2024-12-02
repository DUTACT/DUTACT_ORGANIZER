type GeoPosition = {
  lat: number
  lng: number
}

type CheckInLocation = {
  title: string
  address?: string
  geoPosition: GeoPosition
}

export type CheckInCode = {
  id: string
  title: string
  startAt: string
  endAt: string
  location?: CheckInLocation
}

export type CheckInCodeBody = {
  eventId: number
  title: string
  startAt: string
  endAt: string
  location?: CheckInLocation
}
