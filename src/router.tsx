import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom'

import { Landing, Summary } from './pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: 'summary',
        element: <Summary />,
      },
    ],
  },
]

const router = createBrowserRouter(routes)

export default router
