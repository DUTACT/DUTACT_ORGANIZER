import { useEffect, useRef } from 'react'
import { client } from './queryClient'
import { useLocation } from 'react-router-dom'
import useLocalStorage from 'src/hooks/useLocalStorage'

const RequestInterceptor = () => {
  const [accessToken, _] = useLocalStorage<string>('access_token', '')
  const location = useLocation()
  const interceptorId = useRef<any>()

  useEffect(() => {
    interceptorId.current = client.interceptors.request.use(
      async (config: any) => {
        if (accessToken && location.pathname !== '/login') {
          config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
      },
      (error: any) => Promise.reject(error)
    )
  }, [location])

  return null
}

export default RequestInterceptor
