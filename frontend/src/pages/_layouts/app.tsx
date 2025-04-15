import { Outlet } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderApp } from "@/components/headers/header-app";

export const AppLayout = () => {
  return (
    <>
      <HeaderApp />
      <div className="mx-auto min-h-screen w-xs flex-1 px-2 py-6 pb-40 md:w-3xl md:px-0 2xl:w-5xl">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
