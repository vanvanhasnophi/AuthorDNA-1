import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { PreviewInspectorBridge } from '@/components/PreviewInspectorBridge'
import { ThemeProvider, initializeTheme } from '@/components/ThemeProvider'

import { MockSystemProvider } from '@/components/MockSystemProvider'
import { router } from '@/router'

import './index.css'

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MockSystemProvider>
        <PreviewInspectorBridge />
        <RouterProvider router={router} />
      </MockSystemProvider>
    </ThemeProvider>
  </StrictMode>,
)
