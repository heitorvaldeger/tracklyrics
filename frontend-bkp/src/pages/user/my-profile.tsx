import { Button, Label } from "@/components/ui/_index";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaPencil } from "react-icons/fa6";
import { useMyProfile } from "@/hooks/use-my-profile";

export const MyProfile = () => {
  const { userFullInfo, userNameInitials } = useMyProfile();

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl font-bold">My Profile</header>
      <div className="border-gray-200 border p-4 flex gap-2 items-center rounded">
        <Avatar className="hover:opacity-50 transition-opacity outline outline-2 outline-teal-500 w-16 h-16 cursor-pointer">
          <AvatarImage src="https://github.com/heitorvaldeger.png" sizes="8" alt="avatar" />
          <AvatarFallback>{userNameInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{`${userFullInfo?.firstName} ${userFullInfo?.lastName}`}</span>
          <span className="font-light text-xs md:text-sm text-gray-500 opacity-50">{userFullInfo?.email}</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between font-bold">
          Personal Information
          <Button variant="outline" className="font-bold text-gray-500 opacity-50">
            <FaPencil />
            Edit
          </Button>
        </header>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">First Name</Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">{userFullInfo?.firstName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">Last Name</Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">{userFullInfo?.lastName}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">E-mail</Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">{userFullInfo?.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-slate-400 font-bold opacity-50">Username</Label>
            <span className="text-slate-500 font-bold text-sm opacity-60">{userFullInfo?.username}</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded p-4 flex flex-col gap-3">
        <header className="flex items-center justify-between font-bold">Change Password</header>
        <div className="flex flex-col gap-1">
          <Label className="text-slate-400 font-bold opacity-50">Your Password</Label>
          <span className="text-slate-500 font-bold text-sm opacity-60">*********</span>
        </div>
      </div>
    </div>
  );
};
