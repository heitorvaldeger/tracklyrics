import { SWRConfig } from "swr"
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes"
import { UserAuthProvider } from "./contexts/UserAuthContext"
import { AppProvider } from "./contexts/AppContext"

function App() {
  return (
    <SWRConfig>
      <UserAuthProvider>
        <AppProvider>
          <AppRoutes />
          <Toaster />
        </AppProvider>
      </UserAuthProvider>
    </SWRConfig>
  )
}

export default App
