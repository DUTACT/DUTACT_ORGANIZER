import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { path } from './path'
import AuthenLayout from 'src/layouts/AuthenLayout'
import Login from 'src/pages/Login'
import HomePage from 'src/pages/HomePage'
import PageNotFound from 'src/pages/PageNotFound'
import MainLayout from 'src/layouts/MainLayout'
import { useAppContext } from 'src/contexts/app.context'
import UserManagement from 'src/pages/UserManagement'
import EventManagement from 'src/pages/EventManagement'
import { useEffect } from 'react'
import { ROUTE_CONFIG } from 'src/constants/routeConfig'
import CreateEventPage from 'src/pages/CreateEventPage'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppContext()
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

const RejectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppContext()
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElements() {
  const { setCurrentPageInfo } = useAppContext()
  useEffect(() => {
    console.log('location.pathname', location.pathname)
    const currentRoute = ROUTE_CONFIG.find((route) => route.path === location.pathname)
    if (currentRoute) {
      setCurrentPageInfo({ title: currentRoute.title, icon: currentRoute.icon })
    }
  }, [location, setCurrentPageInfo])

  return useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.home,
          index: true,
          element: (
            <MainLayout>
              <HomePage />
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserManagement />
            </MainLayout>
          )
        },
        {
          path: path.event,
          element: (
            <MainLayout>
              <EventManagement />
            </MainLayout>
          )
        },
        {
          path: path.createEvent,
          element: (
            <MainLayout>
              <CreateEventPage />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <AuthenLayout>
              <Login />
            </AuthenLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <AuthenLayout>
          <PageNotFound />
        </AuthenLayout>
      )
    }
  ])
}
