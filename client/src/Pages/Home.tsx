import HeroSection from "@/components/HeroSection";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.user_type === "admin") {
      navigate("/admin/dashboard");
    }
  })
  if(user && user.user_type === "admin") return null
  return (
    <div className="w-full mx-auto flex justify-center items-center">
      <HeroSection />
    </div>
  );
}

export default Home;
