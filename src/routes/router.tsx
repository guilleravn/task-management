import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { SettingsPage } from '../pages/SettingsPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ErrorPage } from '../pages/ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'projects', element: <PlaceholderPage title="Projects" /> },
      { path: 'team', element: <PlaceholderPage title="Team" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
