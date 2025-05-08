import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Home,
  Megaphone,
  HelpCircle,
  PersonStanding,
  HistoryIcon,
  User2Icon,
  Search,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/store/auth/authSlice";
import { Separator } from "./ui/separator";
import ThemeToggler from "./ThemeToggler";
import { findLink } from "@/utils/findActiveLink";
import Logo from "../assets/logo-removebg-preview.png";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setLoading] = useState(false);
  const { open, setOpen, isMobile } = useSidebar();
  useEffect(() => {
    setActive(findLink(pathname));
  }, [pathname]);
  const handleLogout = () => {
    setLoading(true);
    try {
      dispatch(logout());
      // window.location.reload();
      navigate("/");
      toast({
        variant: "default",
        title: "✅ Successfully Logged out",
      });
    } catch (error) {
      toast({
        variant: "default",
        title: "❌ Failed to Logout",
      });
    }
    setLoading(false);
  };
  return (
    <Sidebar
      className={` border-r h-screen ${open ? "w-64" : "w-16"} overflow-hidden`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-center font-bold text-xl">
        {isMobile || open ? (
          "Hope Horizon Charity "
        ) : (
          <Avatar>
            <AvatarImage src={Logo} alt="avatar" className="w-10 h-10" />
          </Avatar>
        )}
        <ThemeToggler />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <Command>
          {isMobile || open ? (
            <CommandInput
              placeholder={`${
                isMobile || open ? "Type a command or search..." : ""
              }`}
            />
          ) : (
            <Search
              style={{
                width: "20px",
                height: "20px",
                color: "gray",
                margin: "10px auto 3px auto",
                cursor: "pointer",
              }}
              onClick={() => setOpen(true)}
            />
          )}
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading={`${isMobile || open ? "Administrative Controls" : ""}`}
            >
              {/* <CommandItem
                className={`font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  (isMobile || open) ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 0 ? "text-primary" : ""
                  }`}
                >
                  <Home style={{ width: "30px", height: "30px" }} />{" "}
                  {(isMobile || open) ? "Home" : ""}
                </Link>
              </CommandItem> */}
              <CommandItem
                className={`font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  isMobile || open ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/admin/dashboard"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 1 ? "text-primary" : ""
                  }`}
                >
                  <LayoutDashboard style={{ width: "30px", height: "30px" }} />
                  {isMobile || open ? "Dashboard" : ""}
                </Link>
              </CommandItem>
              <CommandItem
                className={`font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  isMobile || open ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/admin/donor-dashboard"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 2 ? "text-primary" : ""
                  }`}
                >
                  <Users style={{ width: "30px", height: "30px" }} />{" "}
                  {isMobile || open ? "Donors" : ""}
                </Link>
              </CommandItem>
              <CommandItem
                className={`font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  isMobile || open ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/admin/campaigns-dashboard"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 3 ? "text-primary" : ""
                  }`}
                >
                  <Megaphone style={{ width: "30px", height: "30px" }} />{" "}
                  {isMobile || open ? "Campaigns" : ""}
                </Link>
              </CommandItem>
              <CommandItem
                className={`font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  isMobile || open ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/admin/helpcenter"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 4 ? "text-primary" : ""
                  }`}
                >
                  <HelpCircle style={{ width: "30px", height: "30px" }} />{" "}
                  {isMobile || open ? "Help Center" : ""}
                </Link>
              </CommandItem>
              <CommandItem
                className={`flex gap-x-2 items-center font-semibold text-xl cursor-pointer hover:bg-secondary ${
                  isMobile || open ? "" : "justify-center"
                } my-3`}
              >
                <Link
                  to="/admin/volunteer-dashboard"
                  className={`w-full flex gap-x-2 items-center ${
                    active === 5 ? "text-primary" : ""
                  }`}
                >
                  <PersonStanding style={{ width: "30px", height: "30px" }} />{" "}
                  {isMobile || open ? "Volunteers" : ""}
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-x-2 items-center">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground ">
                {user?.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {(isMobile || open) && (
              <>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-start">{user?.username}</h3>
                  <h4 className="text-sm font-light italic text-start">
                    ~{user?.email}
                  </h4>
                </div>
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile" className="flex gap-2 items-center w-full">
                {" "}
                <User2Icon /> Profile
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link to="/profile" className="flex gap-2 items-center w-full">
                {" "}
                <HistoryIcon /> History
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut /> {isLoading ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      {isLoading && (
        <div className="w-20 h-20 fixed top-1/2 left-1/2">
          <Loader2 className="animate-spin dark:text-primary" size={45} />
        </div>
      )}
    </Sidebar>
  );
}
