export type Option = {
  label: any
  value: any
}

export interface OptionSelect {
  label: string
  value: any
}

export interface SeriesData {
  series: {
    name: string,
    data: number[]
  }[]
}