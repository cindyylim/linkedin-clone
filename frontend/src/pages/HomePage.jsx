import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";


const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
    </div>
  );
};

export default HomePage;
