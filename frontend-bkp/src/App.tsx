import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { GenreProvider } from "./contexts/GenreContext";
import { LanguageProvider } from "./contexts/LanguageContext";

import "./index.css";
export const App = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto relative">
      <SWRConfig
        value={{
          onErrorRetry: () => {
            return;
          },
        }}
      >
        <UserAuthProvider>
          <GenreProvider>
            <LanguageProvider>
              <AppRoutes />
              <Toaster />
            </LanguageProvider>
          </GenreProvider>
        </UserAuthProvider>
      </SWRConfig>
    </div>
  );
};
