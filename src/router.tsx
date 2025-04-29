import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom'

import { Landing } from './pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [{ index: true, element: <Landing /> }],
  },
]

const router = createBrowserRouter(routes)

export default router
