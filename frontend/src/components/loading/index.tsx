import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex flex-col gap-2 min-h-screen justify-center items-center">
      <Loader2 className="h-6 w-6 animate-spin" />
      Loading...
    </div>
  );
};
