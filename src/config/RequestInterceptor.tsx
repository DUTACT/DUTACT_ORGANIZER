import { useEffect, useRef } from 'react'
import { client } from './queryClient'
import { useLocation } from 'react-router-dom'
import { path } from 'src/routes/path'

const RequestInterceptor = () => {
  const location = useLocation()
  const interceptorId = useRef<any>()

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const parsedToken = accessToken ? JSON.parse(accessToken) : null
    const tokenString = parsedToken ? parsedToken.toString() : ''
    interceptorId.current = client.interceptors.request.use(
      async (config: any) => {
        if (tokenString && location.pathname !== path.login) {
          config.headers.Authorization = `Bearer ${tokenString}`
        }

        return config
      },
      (error: any) => Promise.reject(error)
    )

    return () => {
      client.interceptors.response.eject(interceptorId.current)
    }
  }, [location])

  return null
}

export default RequestInterceptor
