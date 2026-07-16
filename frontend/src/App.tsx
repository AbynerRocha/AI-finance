import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./contexts/Auth";
import { getRouter } from "./router";

function InnerApp() {
    const auth = useAuth()
    const router = getRouter()

    return <RouterProvider defaultErrorComponent={(v) => {<p>{v.error.message}</p>}} router={router} context={{ auth }} />
}

export default function App() {
    return <AuthProvider>
        <InnerApp />
    </AuthProvider>
}

