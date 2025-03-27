import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";

export const TabDetailsSkeleton = () => {
  return (
    <TabsContent
      value="details"
      className="flex flex-col w-auto px-1 space-y-4 flex-1 overflow-y-auto py-4"
    >
      <div className="space-y-2">
        <Label htmlFor="linkYoutube">YouTube Video URL *</Label>
        <Skeleton className="h-4 w-full" />
        <p className="text-sm text-muted-foreground">
          Paste the full YouTube URL of the video you want to add
        </p>
      </div>

      <div className="space-y-2">
        <Label>Video Preview</Label>
        <div className="rounded-md border">
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="title">Title *</Label>
          <Skeleton className="h-4" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist">Artist *</Label>
          <Skeleton className="h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="genre">Genre *</Label>
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language *</Label>
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="releaseYear">Release year *</Label>
        <Skeleton className="h-4 w-[80px]" />
      </div>
    </TabsContent>
  );
};
