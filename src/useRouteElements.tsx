import { Navigate, Outlet, useRoutes } from 'react-router-dom'
// import ProductList from './pages/ProductList'
// import Register from './pages/Register'
import RegisterLayout from './layout/RegisterLayout'
import MainLayout from './layout/MainLayout'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constant/path'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layout/CartLayout'
import UserLayout from './pages/User/layout/UserLayout'
import LoadingScreen from './pages/LoadingScreen'
// import ChangePassword from './pages/User/ChangePassword'
// import HistoryPurchase from './pages/User/HistoryPurchase'
// import Profile from './pages/User/Profile'
// import Notfound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/HistoryPurchase'))
const Notfound = lazy(() => import('./pages/NotFound'))

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
        <Suspense fallback={<LoadingScreen />}>
          <ProductDetail />
        </Suspense>
      </MainLayout>
    },
    {
      path: '/',
      index: true,
      element: <MainLayout>
        <Suspense fallback={<LoadingScreen />}>
          <ProductList />
        </Suspense>
      </MainLayout>
    },
    {
      path: '*',
      element: <MainLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Notfound />
        </Suspense>
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
                  <Suspense fallback={<LoadingScreen />}>
                    <Cart />
                  </Suspense>
                </CartLayout>
              )
            },
            {
              path: path.profile,
              element: (
                <MainLayout>
                  <UserLayout>
                    <Suspense fallback={<LoadingScreen />}>
                      <Profile />
                    </Suspense>
                  </UserLayout>
                </MainLayout>
              )
            },
            {
              path: path.changePassword,
              element: (
                <MainLayout>
                  <UserLayout>
                    <Suspense fallback={<LoadingScreen />}>
                      <ChangePassword />
                    </Suspense>
                  </UserLayout>
                </MainLayout>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <MainLayout>
                  <UserLayout>
                    <Suspense fallback={<LoadingScreen />}>
                      <HistoryPurchase />
                    </Suspense>
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
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          </RegisterLayout>
        },
        {
          path: path.register,
          element: <RegisterLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Register />
            </Suspense>
          </RegisterLayout>
        }

      ]
    }
  ])
  return routeElements
}