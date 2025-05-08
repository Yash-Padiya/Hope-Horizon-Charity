import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import GreetingBar from "@/components/GreetingBar";
import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
function RootLayout() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      {/* This navbar is for donors and visitors only and is fully responsive */}
      <Toaster />

      {((user && user.user_type === "donor") || !user) && (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
      {user && user.user_type === "admin" && (
        <SidebarProvider defaultOpen >
          <main className="flex w-full">
            <AdminSidebar />
            <div className="w-full py-10">
              <GreetingBar />
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      )}
    </>
  );
}

export default RootLayout;
