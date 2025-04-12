import { Navigate, Outlet } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderApp } from "@/components/headers/header-app";
import { Loading } from "@/components/loading";
import { useSession } from "@/contexts/session-context";

export const AppLayout = () => {
  const { hasSession, isLoading } = useSession();

  if (hasSession && !isLoading) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

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
