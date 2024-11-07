export type MutationMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface QueryFetchOptions {
  url: string
  inputParams?: any
  token?: string
}

export interface MutationFetchOptions {
  url: string
  method: MutationMethodType
  body?: any
  baseURL?: string
}

export interface ApiError {
  status: number
  message?: string
}

export interface MutationResult<T> {
  data: T
  status: number
}
