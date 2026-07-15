import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async ({ context, search }) => {
    if(context.auth?.isAuthenticated) {
      // Redirect to dashboard page 
      throw redirect({
        to: '/dashboard',
        search: search, 
        replace: true,
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
