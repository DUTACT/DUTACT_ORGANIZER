export interface GeoPosition {
  lat: number
  lng: number
}

export interface GeoAddress {
  label: string
}

export interface GeoItem {
  id: string
  title: string
  position: GeoPosition
  address?: GeoAddress
}

export interface GeoCodeResponse {
  items: GeoItem[]
}
