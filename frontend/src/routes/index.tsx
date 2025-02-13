import { DefaultLayout } from "@/views/_layouts/DefaultLayout"
import { UserLayout } from "@/views/_layouts/UserLayout"
import { FavoritesView } from "@/views/User/FavoritesView"
import { HomeView } from "@/views/HomeView"
import { LoginView } from "@/views/LoginView"
import { RegisterView } from "@/views/RegisterView"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router"
import { LyricsView } from "@/views/User/LyricsView"
import { MyProfileView } from "@/views/User/MyProfileView"
import { useUserAuth } from "@/contexts/UserAuthContext"
import { PropsWithChildren } from "react"
import { VideoSearchView } from "@/views/VideoSearchView"

type RouteMiddlewareProps = {
  isAllowed?: boolean
  redirectPath?: string,
}
const RouteMiddleware = ({
  isAllowed,
  redirectPath = "/",
  children
}: PropsWithChildren<RouteMiddlewareProps>) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export const AppRoutes = () => {
  const { isAllowed } = useUserAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route element={isAllowed ? <UserLayout/> : <DefaultLayout />}>
          <Route index element={<HomeView />}/>
          <Route path="/search/:genreId" element={<VideoSearchView />}/>
        </Route>
        <Route path="register" element={!isAllowed ? <RegisterView /> : <RouteMiddleware/>}/>
        <Route path="login" element={!isAllowed ? <LoginView /> : <RouteMiddleware/>}/>

        <Route element={<RouteMiddleware isAllowed={isAllowed} />}>
          <Route element={<UserLayout/>}>
            <Route path="favorites" element={<FavoritesView />}/>
            <Route path="lyrics" element={<LyricsView />}/>
            <Route path="profile" element={<MyProfileView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}