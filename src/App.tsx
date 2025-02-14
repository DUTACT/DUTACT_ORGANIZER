import { useLocation } from 'react-router-dom'
import useRouteElements from './routes/useRouteElements'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ROUTE_CONFIG } from './constants/routeConfig'
import { useAppContext } from './contexts/app.context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'leaflet/dist/leaflet.css'
import RequestInterceptor from './config/RequestInterceptor'
import ResponseInterceptor from './config/ResponseInterceptor'
import ModalConfirm from 'src/components/ModalConfirm'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 0
    }
  }
})

export default function App() {
  const routeElements = useRouteElements()
  const { setCurrentPageInfo } = useAppContext()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const currentRoute = ROUTE_CONFIG.find((route) => route.path === location.pathname)
    if (currentRoute) {
      setCurrentPageInfo({ title: currentRoute.title, icon: currentRoute.icon })
    }
  }, [pathname])

  return (
    <QueryClientProvider client={queryClient}>
      <RequestInterceptor />
      <ResponseInterceptor />
      {routeElements}
      <ModalConfirm />
      <ToastContainer />
    </QueryClientProvider>
  )
}
