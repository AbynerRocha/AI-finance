import { Header } from '#/components/Header/index.tsx';
import { Sidebar } from '#/components/Sidebar/index.tsx';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/(dashboard)')({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.isAuthenticated) {
      // Redirect to login page 
      throw redirect({
        to: '/login',
        replace: true,
        search: {
          redirect: window.location.pathname
        }
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        handleLogout={async () => {
          auth?.logout()
          navigate({
            to: "/login",
            search: {
              redirect: ""
            }
          })
        }}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header
          setSidebarOpen={setSidebarOpen}
        />
        <main className="min-w-0 flex-1 overflow-auto mb-28 lg:mb-12">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
