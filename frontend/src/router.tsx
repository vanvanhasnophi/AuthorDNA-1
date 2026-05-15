import { createBrowserRouter } from 'react-router-dom'

import AuthorDnaNegotiation from '@/pages/AuthorDnaNegotiation'

const routes = [
  {
    path: '/',
    element: <AuthorDnaNegotiation />,
  },
]

export const router = createBrowserRouter(routes)
