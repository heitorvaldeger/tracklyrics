import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/pages/_layouts/app";
import { AuthenticatedLayout } from "@/pages/_layouts/authenticated";
import { Home } from "@/pages/app/home";
import { SignIn } from "@/pages/auth/sign-in";

import { LayoutSwitcher } from "./pages/_layouts/layout-switcher";
import { UserProfile } from "./pages/app/user-profile";
import { VideoSearch } from "./pages/app/video-search";
import { Register } from "./pages/auth/register";

export const router = createBrowserRouter([
  {
    element: <LayoutSwitcher />,
    children: [
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <VideoSearch />,
        path: "/search",
      },
    ],
  },
  {
    children: [
      {
        element: <SignIn />,
        path: "sign-in",
      },
      {
        element: <Register />,
        path: "register",
      },
    ],
    element: <AppLayout />,
  },
  {
    children: [
      {
        element: <UserProfile />,
        path: "/profile",
      },
    ],
    element: <AuthenticatedLayout />,
  },
]);
