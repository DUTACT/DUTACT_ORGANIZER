import { useEffect, useRef } from 'react'
import { client } from './queryClient'
import { toast } from 'react-toastify'
import { HttpStatusCode } from 'axios'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { useLocation, useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'
import { ERROR_MESSAGE } from 'src/constants/message'

const ResponseInterceptor = () => {
  const [_, setAccessToken] = useLocalStorage<string>('access_token', '')
  const location = useLocation()
  const navigate = useNavigate()
  const interceptorId = useRef<any>()

  useEffect(() => {
    interceptorId.current = client.interceptors.response.use(undefined, (error: any) => {
      if (error.response.status === HttpStatusCode.Unauthorized) {
        navigate(path.login)
        setAccessToken('')
      } else if (error.response.status === HttpStatusCode.Forbidden) {
        toast.warn(ERROR_MESSAGE.forbidden)
      } else if (error.response.status === HttpStatusCode.PayloadTooLarge) {
        toast.error(ERROR_MESSAGE.payload_too_large)
      }

      return Promise.reject(error)
    })

    return () => {
      client.interceptors.response.eject(interceptorId.current)
    }
  }, [location])

  return null
}

export default ResponseInterceptor
