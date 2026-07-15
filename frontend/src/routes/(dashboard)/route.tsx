import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
  return <>
    <Outlet/>
  </>
}
