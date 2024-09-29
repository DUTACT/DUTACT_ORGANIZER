import { useRoutes } from 'react-router-dom'
import { path } from './path'
import AuthenLayout from 'src/layouts/AuthenLayout'
import Login from 'src/pages/Login'
import ForgotPassword from 'src/pages/ForgotPassword'


export default function useRouteElements() {
  return useRoutes([
    {
      path: '',
      element: <AuthenLayout />,
      children: [
        {
          path: path.login,
          index: true,
          element: <Login />
        },
        {
          path: path.forgotPassword,
          index: true,
          element: <ForgotPassword />
        }
      ]
    }
  ])
}