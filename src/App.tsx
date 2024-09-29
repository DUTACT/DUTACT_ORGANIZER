import { useLocation } from 'react-router-dom'
import useRouteElements from './routes/useRouteElements'
import { useEffect } from 'react'

function App() {
  const routeElements = useRouteElements()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return <>{routeElements}</>
}

export default App
