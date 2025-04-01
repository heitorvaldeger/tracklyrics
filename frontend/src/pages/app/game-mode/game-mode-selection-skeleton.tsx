import { Skeleton } from "@/components/ui/skeleton";

export const ModeCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, id) => (
        <div
          key={id}
          className={`border rounded-lg p-4 cursor-pointer transition-all`}
        >
          <div className="flex items-start cursor-pointer">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
