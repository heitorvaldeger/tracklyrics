import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { AppRoutes } from "./routes"
import { Toaster } from "@/components/ui/toaster"
import { UserAuthProvider } from "./contexts/UserAuthContext"

const queryClient = new QueryClient()

function App() {
  return (
    <div className="w-full h-full mx-auto">
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <AppRoutes />
          <Toaster duration={3000} />
        </UserAuthProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
