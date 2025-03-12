import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserAvatar = () => {
  return (
    <Avatar className="mx-2 hover:opacity-50 transition-opacity outline outline-2 outline-teal-500">
      <AvatarImage src="https://github.com/heitorvaldeger.png" />
      <AvatarFallback>HA</AvatarFallback>
    </Avatar>
  );
};
