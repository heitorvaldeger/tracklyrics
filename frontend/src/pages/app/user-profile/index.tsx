import { Pencil } from "lucide-react";
import { useQuery } from "react-query";
import { toast } from "sonner";

import { fetchUserProfile } from "@/api/fetch-user-profile";
import { AvatarUser } from "@/components/avatar/avatar-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfile = () => {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
    onError: () => {
      toast.error("Sorry, an error occurred!");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl font-bold">My Profile</header>
      <div className="border-gray-200 border p-4 flex gap-2 items-center rounded">
        <AvatarUser className="w-16 h-16" />
        <div className={`flex flex-col ${isLoading ? "space-y-4" : null}`}>
          <span className="font-bold text-lg">
            {isLoading ? (
              <Skeleton className="h-3 w-32" />
            ) : (
              `${userProfile?.firstName} ${userProfile?.lastName}`
            )}
          </span>
          <span className="font-light text-xs md:text-sm text-gray-500 opacity-50">
            {isLoading ? <Skeleton className="h-3 w-40" /> : userProfile?.email}
          </span>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between font-bold">
          Personal Information
          <Button
            variant="outline"
            className="font-bold text-gray-500 opacity-50"
          >
            <Pencil />
            Edit
          </Button>
        </header>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              First Name
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-16" />
              ) : (
                userProfile?.firstName
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              Last Name
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-16" />
              ) : (
                userProfile?.lastName
              )}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              E-mail
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-40" />
              ) : (
                userProfile?.email
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">
              Username
            </Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">
              {isLoading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                userProfile?.username
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between font-bold">
          Change Password
        </header>
        <div className="flex flex-col gap-1">
          <Label className="text-slate-400 font-bold opacity-50">
            Your Password
          </Label>
          <span className="text-slate-500 font-bold text-sm opacity-60">
            *********
          </span>
        </div>
      </div>
    </div>
  );
};
