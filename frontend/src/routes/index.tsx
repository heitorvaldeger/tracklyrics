import { RegisterView } from "@/views/register"
import { BrowserRouter, Route, Routes } from "react-router"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<></>}/>

        <Route path="register" element={<RegisterView />}/>
      </Routes>
    </BrowserRouter>
  )
}