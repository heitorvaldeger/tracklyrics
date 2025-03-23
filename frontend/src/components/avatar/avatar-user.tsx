import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AvatarUser = ({
  className,
}: React.ComponentProps<typeof Avatar>) => {
  return (
    <Avatar
      className={`mx-2 outline-2 outline-teal-500 transition-opacity hover:opacity-50 ${className}`}
    >
      <AvatarImage src="https://github.com/heitorvaldeger.png" />
      <AvatarFallback>HA</AvatarFallback>
    </Avatar>
  );
};
