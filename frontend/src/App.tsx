import { QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { GenreLanguageProvider } from "@/contexts/genre-language-context";
import { UserProvider } from "@/contexts/user-context";
import { queryClient } from "@/lib/react-query";
import { router } from "@/routes";

import { SessionProvider } from "./contexts/session-context";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <UserProvider>
          <GenreLanguageProvider>
            <RouterProvider router={router} />
          </GenreLanguageProvider>
        </UserProvider>
      </SessionProvider>
      <Toaster richColors />
    </QueryClientProvider>
  );
};
