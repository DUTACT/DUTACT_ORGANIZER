export type PageInfo<T> = {
  data: T[]
  pagination: PagniationMetadata
}

export type PagniationMetadata = {
  totalData: number
  totalPage: number
  currentPage: number
  pageSize: number
}
