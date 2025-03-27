import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/pages/_layouts/app";
import { AuthenticatedLayout } from "@/pages/_layouts/authenticated";
import { Home } from "@/pages/app/home";
import { SignIn } from "@/pages/auth/sign-in";

import { LayoutSwitcher } from "./pages/_layouts/layout-switcher";
import { UserFavorites } from "./pages/app/user-favorites";
import { UserLyrics } from "./pages/app/user-lyrics";
import { UserProfile } from "./pages/app/user-profile";
import { VideoSave } from "./pages/app/video-save";
import { VideoSearch } from "./pages/app/video-search";
import { Register } from "./pages/auth/register";

export const router = createBrowserRouter([
  {
    element: <LayoutSwitcher />,
    children: [
      {
        element: <Home />,
        index: true,
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
      {
        element: <UserFavorites />,
        path: "/favorites",
      },
      {
        element: <UserLyrics />,
        path: "/lyrics",
      },
    ],
    element: <AuthenticatedLayout />,
  },
  {
    element: <VideoSave />,
    path: "/video/save",
  },
]);
