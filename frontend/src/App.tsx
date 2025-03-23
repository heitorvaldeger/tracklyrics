import { QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { GenreLanguageProvider } from "@/contexts/genre-language-context";
import { queryClient } from "@/lib/react-query";
import { router } from "@/routes";

import { SessionProvider } from "./contexts/session-context";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <GenreLanguageProvider>
          <RouterProvider router={router} />
        </GenreLanguageProvider>
      </SessionProvider>
      <Toaster richColors />
    </QueryClientProvider>
  );
};
