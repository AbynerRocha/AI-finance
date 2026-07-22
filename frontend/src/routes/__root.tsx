import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import '../styles.css'
import { type AuthContextData } from '#/contexts/Auth.tsx';

interface RouterContext {
  auth: AuthContextData | null
}


export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: (search: Record<string, unknown>) => {
    const redirect = search.redirect

    return typeof redirect === "string"
      ? { redirect }
      : {}
  },
  component: RootComponent,
  errorComponent: ({ error }) => {
    return JSON.stringify(error)
  }
})

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  )
}
