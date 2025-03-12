import { Outlet } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderApp } from "@/components/headers/header-app";

export const AppLayout = () => {
  return (
    <>
      <HeaderApp />
      <div className="mx-auto min-h-screen w-3/4 pt-4 pb-40 2xl:w-2/4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
