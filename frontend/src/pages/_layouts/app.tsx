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
      <div className="mx-auto min-h-screen w-3/4 pt-4 pb-40 2xl:w-2/4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
