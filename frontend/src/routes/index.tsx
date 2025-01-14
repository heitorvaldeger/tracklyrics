import { DefaultLayout } from "@/layouts/DefaultLayout"
import { UserLayout } from "@/layouts/UserLayout"
import { FavoritesView } from "@/views/User/FavoritesView"
import { HomeView } from "@/views/HomeView"
import { LoginView } from "@/views/LoginView"
import { RegisterView } from "@/views/RegisterView"
import { BrowserRouter, Route, Routes } from "react-router"
import { LyricsView } from "@/views/User/LyricsView"
import { MyProfileView } from "@/views/User/MyProfileView"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomeView />}/>
        </Route>

        <Route element={<UserLayout/>}>
          <Route path="favorites" element={<FavoritesView />}/>
          <Route path="lyrics" element={<LyricsView />}/>
          <Route path="my-profile" element={<MyProfileView />} />
        </Route>

        <Route path="register" element={<RegisterView />}/>
        <Route path="login" element={<LoginView />}/>

      </Routes>
    </BrowserRouter>
  )
}