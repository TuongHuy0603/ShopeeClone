import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layout/RegisterLayout'
import MainLayout from './layout/MainLayout'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constant/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CartLayout from './layout/CartLayout'
import UserLayout from './pages/User/layout/UserLayout'
import ChangePassword from './pages/User/ChangePassword'
import HistoryPurchase from './pages/User/HistoryPurchase'
import Profile from './pages/User/Profile'
import Notfound from './pages/NotFound'

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.productDetail,
      index: true,
      element: <MainLayout>
        <ProductDetail />
      </MainLayout>
    },
    {
      path: '/',
      index: true,
      element: <MainLayout>
        <ProductList />
      </MainLayout>
    },
    {
      path: '*',
      element: <MainLayout>
        <Notfound />
      </MainLayout>
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          children: [
            {
              path: path.cart,
              element: (
                <CartLayout>
                  <Cart />
                </CartLayout>
              )
            },
            {
              path: path.profile,
              element: (
                <MainLayout>
                  <UserLayout>
                    <Profile />
                  </UserLayout>
                </MainLayout>
              )
            },
            {
              path: path.changePassword,
              element: (
                <MainLayout>
                  <UserLayout>
                    <ChangePassword />
                  </UserLayout>
                </MainLayout>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <MainLayout>
                  <UserLayout>
                    <HistoryPurchase />
                  </UserLayout>
                </MainLayout>
              )
            },
          ]
        }
      ]
    }
    ,
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <RegisterLayout>
            <Login />
          </RegisterLayout>
        },
        {
          path: path.register,
          element: <RegisterLayout>
            <Register />
          </RegisterLayout>
        }

      ]
    }
  ])
  return routeElements
}
