import { SWRConfig } from "swr"
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes"
import { UserAuthProvider } from "./contexts/UserAuthContext"
import { GenreLanguageProvider } from "./contexts/GenreLanguageContext"
import { GenreProvider } from "./contexts/GenreContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <SWRConfig value={{
      onErrorRetry: () => {
        return
      }
    }}>
      <UserAuthProvider>
        <GenreLanguageProvider>
          <GenreProvider>
            <LanguageProvider>
              <AppRoutes />
              <Toaster />
            </LanguageProvider>
          </GenreProvider>
        </GenreLanguageProvider>
      </UserAuthProvider>
    </SWRConfig>
  )
}

export default App
