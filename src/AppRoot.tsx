import { RouterProvider } from 'react-router-dom'

import router from './router'

function AppRoot() {
  return <RouterProvider router={router} />
}

export default AppRoot
