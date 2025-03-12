import { Outlet } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderAuthenticated } from "@/components/headers/header-authenticated";

export const AuthenticatedLayout = () => {
  return (
    <>
      <HeaderAuthenticated />
      <div className="mx-auto min-h-screen w-3/4 flex-1 px-2 py-6 pb-40 md:w-3/5 md:px-0 2xl:w-2/4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
