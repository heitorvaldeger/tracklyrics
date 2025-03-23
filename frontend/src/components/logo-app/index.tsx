import { useNavigate } from "react-router";

export const LogoApp = () => {
  const navigate = useNavigate();

  return (
    <div
      className="mx-2 flex cursor-pointer items-center justify-center gap-1 text-2xl"
      onClick={() => navigate("/")}
    >
      <span className="text-primary font-bold">Track</span>
      <span>lyrics</span>
    </div>
  );
};
