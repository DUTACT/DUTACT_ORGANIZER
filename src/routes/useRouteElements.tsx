import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { path } from './path'
import AuthenLayout from 'src/layouts/AuthenLayout'
import Login from 'src/pages/Login'
import HomePage from 'src/pages/HomePage'
import PageNotFound from 'src/pages/PageNotFound'
import MainLayout from 'src/layouts/MainLayout'
import { useAppContext } from 'src/contexts/app.context'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppContext()
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

const RejectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppContext()
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElements() {
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
