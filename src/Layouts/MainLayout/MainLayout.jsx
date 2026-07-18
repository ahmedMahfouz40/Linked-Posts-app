import { Navigate, Outlet } from "react-router-dom";
import InterfacePage from "../../Pages/InterfacePage/InterfacePage";

const MainLayout = () => {
  return (
    <div className="min-h-screen  bg-[#f0f2f5] px-4  sm:py-12 flex flex-col lg:flex-row lg:items-center    dark:bg-slate-950">
      <div className="w-full   order-2 lg:order-1 ">
        <InterfacePage />
      </div>
      <div className="w-full  order-1 lg:order-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;