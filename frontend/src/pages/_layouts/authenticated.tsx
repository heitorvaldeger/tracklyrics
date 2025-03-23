import { Navigate, Outlet } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderAuthenticated } from "@/components/headers/header-authenticated";
import { Loading } from "@/components/loading";
import { useSession } from "@/contexts/session-context";

export const AuthenticatedLayout = () => {
  const { hasSession, isLoading } = useSession();

  if (!hasSession && !isLoading) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

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
