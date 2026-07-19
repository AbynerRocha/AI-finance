import { Header } from '#/components/Header/index.tsx';
import { Sidebar } from '#/components/Sidebar/index.tsx';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/(dashboard)')({
  beforeLoad: async ({ context }) => {
    if(!context.auth?.isAuthenticated) {
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
    <div className="min-h-screen bg-background flex">
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
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
        />
        <Outlet/>
      </main>
    </div>
  )
}
