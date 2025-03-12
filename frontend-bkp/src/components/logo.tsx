import { useNavigate } from "react-router";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-2 flex justify-center items-center cursor-pointer text-2xl gap-1" onClick={() => navigate("/")}>
      <span className="text-teal-500 font-bold">Track</span>
      <span>lyrics</span>
    </div>
  );
};
