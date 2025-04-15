import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Footer } from "@/components/footer";
import { HeaderAuthenticated } from "@/components/headers/header-authenticated";
import { api } from "@/lib/axios";

export const AuthenticatedLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const code = error.response?.data.code as string;

          if (status === 401 && code === "E_UNAUTHORIZED_ACCESS") {
            await navigate("/sign-in", { replace: true });
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);
  return (
    <>
      <HeaderAuthenticated />
      <div className="mx-auto min-h-screen w-xs flex-1 px-2 py-6 pb-40 md:w-3xl md:px-0 2xl:w-5xl">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
