import { useEffect, useRef } from 'react'
import { client } from './queryClient'
import { toast } from 'react-toastify'
import { HttpStatusCode } from 'axios'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { useLocation, useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'

const ResponseInterceptor = () => {
  const [_, setAccessToken] = useLocalStorage<string>('access_token', '')
  const location = useLocation()
  const navigate = useNavigate()
  const interceptorId = useRef<any>()

  useEffect(() => {
    interceptorId.current = client.interceptors.response.use(undefined, (error: any) => {
      if (error.response.status === HttpStatusCode.Unauthorized) {
        setAccessToken('')
        navigate(path.login)
        toast.warn('Your token has been expired')
      }

      return Promise.reject(error)
    })
  }, [location])

  return null
}

export default ResponseInterceptor
