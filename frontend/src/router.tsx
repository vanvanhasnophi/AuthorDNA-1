import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import AnalysisPage from '@/pages/AnalysisPage'
import FileUploadPage from '@/pages/FileUploadPage'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import WorkspaceShell from '@/pages/Workspace'
import WorkspaceHome from '@/pages/workspace/workspace-home'
import WorkspaceLab from '@/pages/workspace/workspace-lab'
import WorkspaceSettings from '@/pages/workspace/workspace-settings'
import WorkspaceWorks from '@/pages/workspace/workspace-works'
import WorkspaceWritingDna from '@/pages/workspace/workspace-writing-dna'
import { useAdminSession } from '@/stores/use-admin-session'
import { useFileStore } from '@/stores/use-file-store'

function ProtectedRoute() {
  const hasFiles = useFileStore((s) => s.files.length > 0)
  if (!hasFiles) return <Navigate to="/upload" replace />
  return <Outlet />
}

function ProtectedWorkspaceRoute() {
  const isAuthenticated = useAdminSession((state) => state.isAuthenticated)
  const session = useAdminSession((state) => state.session)

  if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace />
  }

  return <WorkspaceShell />
}

const routes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/upload',
    element: <FileUploadPage />,
  },
  {
    path: '/analysis',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <AnalysisPage /> }],
  },
  {
    path: '/workspace',
    element: <ProtectedWorkspaceRoute />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', element: <WorkspaceHome /> },
      { path: 'writing-dna', element: <WorkspaceWritingDna /> },
      { path: 'works', element: <WorkspaceWorks /> },
      { path: 'lab', element: <WorkspaceLab /> },
      { path: 'settings', element: <WorkspaceSettings /> },
      { path: '*', element: <Navigate to="home" replace /> },
    ],
  },
  {
    path: '/dashboard',
    element: <Navigate to="/workspace/home" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

export const router = createBrowserRouter(routes)
