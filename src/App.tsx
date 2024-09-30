import { useLocation } from 'react-router-dom'
import useRouteElements from './routes/useRouteElements'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

function App() {
  const routeElements = useRouteElements()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <QueryClientProvider client={queryClient}>
      {routeElements}
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
