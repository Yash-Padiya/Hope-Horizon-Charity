import {
  CircleHelp,
  HandPlatter,
  HistoryIcon,
  HomeIcon,
  Info,
  Loader2,
  LogOut,
  LogOutIcon,
  Megaphone,
  MenuIcon,
  User2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import ThemeToggler from "./ThemeToggler";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import Logo from "../assets/logo-removebg-preview.png";

function Navbar() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    try {
      dispatch(logout());
      // window.location.reload();
      navigate("/");
      toast({
        variant: "default",
        title: "Logout Successful",
      });
    } catch (error) {
      toast({
        variant: "default",
        title: "Failed to Logout",
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    // Function to check if the screen width is below the threshold
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true); // Set the state to true if width is less than 768px
      } else {
        setIsMobile(false); // Set the state to false if width is greater than or equal to 768px
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener to resize event
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14 py-1">
      <div className="flex items-center gap-x-2">
        <img src={Logo} alt="" className="h-24 w-24 rounded-full -mr-4" />
        <Link to={"/"}>
          <h1 className="text-xl text-freshbasil  comfortaa-apply">
            Hope Horizon
          </h1>
        </Link>
      </div>
      {/* Desktop View */}
      <div className="flex items-center gap-x-8 max-[874px]:gap-x-4">
        <div className="hidden md:flex items-center gap-x-8 max-[874px]:gap-x-5">
          <Link to={"/"}>
            <h1 className="text-lg font-semibold active:scale-105 transition-transform duration-150">
              Home
            </h1>
          </Link>
          <Link to={"/campaigns"}>
            <h1 className="text-lg font-semibold active:scale-105 transition-transform duration-150">
              Campaigns
            </h1>
          </Link>
          <Link to={"/about"}>
            <h1 className="text-lg font-semibold active:scale-105 transition-transform duration-150">
              About
            </h1>
          </Link>
          {user && user.user_type === "donor" && (
            <Link to={"/help-support"}>
              <h1 className="text-lg font-semibold active:scale-105 transition-transform duration-150">
                Support
              </h1>
            </Link>
          )}
          <ThemeToggler />
          {user && user.user_type === "donor" ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    to="/profile"
                    className="flex gap-2 items-center w-full"
                  >
                    {" "}
                    <User2Icon /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/donation/history"
                    className="flex gap-2 items-center w-full"
                  >
                    {" "}
                    <HistoryIcon /> Donation History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    className="p-0 flex gap-x-2 items-center w-full"
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOutIcon /> {isLoading ? "Logging Out..." : "Logout"}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"/auth/login"}>
              <h1 className="text-lg font-semibold bg-primary rounded-full px-4 py-1 transition-transform duration-150 text-primary-foreground">
                Login
              </h1>
            </Link>
          )}
        </div>
        {/* Mobile View */}
        {isMobile && (
          <>
            <ThemeToggler />
            <MobileView
              user={user}
              handleLogout={handleLogout}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

const MobileView = ({
  user,
  handleLogout,
  isLoading,
}: {
  user: any;
  handleLogout: () => void;
  isLoading: boolean;
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon
          size={27}
          className="active:text-hoverfreshBasil rounded-full"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <img
            src={Logo}
            alt="HHC"
            className="h-[105px] w-[105px] mx-auto -my-3"
          />
          <div className="flex flex-row items-center justify-between mt-3 mb-3">
            <SheetTitle>Hope Horizon Charity</SheetTitle>
            <ThemeToggler />
          </div>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col items-start">
          {user && user.user_type === "donor" && (
            <>
              {" "}
              <Link to={"/profile"} className="w-full">
                <SheetClose className="w-full">
                  <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1  py-1">
                    <User2Icon size={18} /> Profile
                  </h1>
                </SheetClose>
              </Link>
              <Link to={"/donation-history"} className="w-full">
                <SheetClose className="w-full">
                  <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1  py-1">
                    <HistoryIcon size={18} /> Donation History
                  </h1>
                </SheetClose>
              </Link>{" "}
            </>
          )}
          <Link to={"/"} className="w-full">
            <SheetClose className="w-full">
              <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1  py-1">
                <HomeIcon size={18} /> Home
              </h1>
            </SheetClose>
          </Link>
          <Link to={"/cart"} className="w-full">
            <SheetClose className="w-full">
              <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1 py-1">
                <Megaphone size={18} /> Campaigns
              </h1>
            </SheetClose>
          </Link>
          <Link to={"/profile"} className="w-full">
            <SheetClose className="w-full">
              <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1 py-1">
                <Info size={18} /> About
              </h1>
            </SheetClose>
          </Link>
          {user && user.user_type === "donor" && (
            <Link to={"/order/status"} className="w-full">
              <SheetClose className="w-full">
                <h1 className="text-lg font-semibold text-gray-700 active:text-hoverfreshBasil active:bg-gray-200 rounded-md flex gap-x-2 items-center my-1 py-1">
                  <CircleHelp size={18} /> Support
                </h1>
              </SheetClose>
            </Link>
          )}
          <Separator />
        </div>
        <SheetFooter>
          {user && user.user_type === "donor" ? (
            <div className="mt-4 flex justify-between items-center w-full max-[460px]:flex-wrap gap-y-3">
              <div className="flex gap-x-2 items-center w-full">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-base font-semibold text-gray-700 ">
                  {user.username}
                </h1>
              </div>

              <div className="w-full">
                {isLoading ? (
                  <Button
                    className="flex gap-x-1 items-center w-full"
                    disabled
                    size={"sm"}
                  >
                    <Loader2 className="animate-spin" size={20} /> Logging Out
                  </Button>
                ) : (
                  <Button
                    className="flex gap-x-1 w-full"
                    size={"sm"}
                    onClick={handleLogout}
                  >
                    <LogOut />
                    Log Out
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Link to={"/auth/login"} className="w-full mt-4 text-center">
              <SheetClose className="w-full">
                <h1 className="text-lg font-semibold bg-primary rounded-full px-4 py-1 text-center text-primary-foreground w-full">
                  Log In
                </h1>
              </SheetClose>
            </Link>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
