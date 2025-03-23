import { useSession } from "@/contexts/session-context";

import { AppLayout } from "./app";
import { AuthenticatedLayout } from "./authenticated";

export const LayoutSwitcher = () => {
  const { hasSession } = useSession();

  return hasSession ? <AuthenticatedLayout /> : <AppLayout />;
};
