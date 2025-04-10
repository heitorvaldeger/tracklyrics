import { Skeleton } from "@/components/ui/skeleton";

export const GamePlaySkeleton = () => {
  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              <Skeleton className="h-4 w-16" />
            </h1>
            <p className="text-muted-foreground">
              <Skeleton className="h-4 w-16" />
            </p>
          </div>
        </div>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col gap-1">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};
