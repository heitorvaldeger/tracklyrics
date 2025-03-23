import { useNavigate } from "react-router";
import { Header } from ".";
import { Button } from "@/components/ui/button";

export const HeaderApp = () => {
  const navigate = useNavigate();

  return (
    <Header>
      <div className="mx-2 flex w-full items-center justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/sign-in")}>
          Sign In
        </Button>
        <Button className="font-medium" onClick={() => navigate("/register")}>
          Get Started
        </Button>
      </div>
    </Header>
  );
};
