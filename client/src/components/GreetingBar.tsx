import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { getGreeting } from "@/utils/greet";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function GreetingBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center gap-x-4 bg-transparent backdrop-blur-md px-4 py-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <SidebarTrigger />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h3 className="text-xl font-bold flex items-center gap-x-1">
        <span className="text-2xl">🚀</span> {getGreeting()},{" "}
        {user?.username.toUpperCase() || "Admin"}{" "}
      </h3>
    </nav>
  );
}

export default GreetingBar;
