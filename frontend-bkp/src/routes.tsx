import { DefaultLayout } from "@/pages/_layouts/default-layout";
import { UserLayout } from "@/pages/_layouts/user-layout";
import { Favorites } from "@/pages/user/favorites";
import { Home } from "@/pages/home";
import { Login } from "@/pages/auth/login";
import { Register } from "@/pages/auth/register";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Lyrics } from "@/pages/user/lyrics";
import { MyProfile } from "@/pages/user/my-profile";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { PropsWithChildren } from "react";
import { VideoSearchView } from "@/pages/video/video-search";
import { GameModes } from "@/pages/game/game-modes";
import { VideoAdd } from "@/pages/video/video-add";

type RouteMiddlewareProps = {
  hasUserLogged?: boolean;
  redirectPath?: string;
};
const RouteMiddleware = ({ hasUserLogged, redirectPath = "/", children }: PropsWithChildren<RouteMiddlewareProps>) => {
  if (!hasUserLogged) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export const AppRoutes = () => {
  const { hasUserLogged } = useUserAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={hasUserLogged ? <UserLayout /> : <DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="/search/:genreId" element={<VideoSearchView />} />
          <Route path="/game/:videoUuid/modes" element={<GameModes />} />
        </Route>

        <Route element={<RouteMiddleware hasUserLogged={hasUserLogged} />}>
          <Route path="/video/add" element={<VideoAdd />} />
          <Route element={<UserLayout />}>
            <Route path="favorites" element={<Favorites />} />
            <Route path="lyrics" element={<Lyrics />} />
            <Route path="profile" element={<MyProfile />} />
          </Route>
        </Route>

        <Route path="register" element={!hasUserLogged ? <Register /> : <RouteMiddleware />} />
        <Route path="login" element={!hasUserLogged ? <Login /> : <RouteMiddleware />} />
      </Routes>
    </BrowserRouter>
  );
};
