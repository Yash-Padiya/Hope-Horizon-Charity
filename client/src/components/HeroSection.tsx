import { cn } from "@/lib/utils";
import HeroSectionBanner from "../assets/herosection.jpg";
import { DotPattern } from "./magicui/dot-pattern";
// import { Button } from "./ui/button";
import { NumberTicker } from "./magicui/number-ticker";
import { Label } from "./ui/label";
import {
  Globe2Icon,
  HandCoins,
  HeartHandshake,
  IndianRupee,
  Plus,
  User2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ShinyButton } from "./magicui/shiny-button";
import MarqueeComponent from "./MarqueeComponent";
import { MagicCard } from "./magicui/magic-card";
import { useTheme } from "./Theme-Provider";
import HopeHorizonLogo from "../assets/logo-removebg-preview.png";

function HeroSection() {
  const { theme } = useTheme();
  const stats = [
    {
      title: "Years of Experience",
      count: 3,
      icon: (
        <Plus size={20} className="text-primary-foreground dark:text-white" />
      ),
    },
    {
      title: "Total Fund Raised",
      count: 1233465,
      icon: (
        <IndianRupee
          size={20}
          className="text-primary-foreground dark:text-white"
        />
      ),
    },
    {
      title: "Donors",
      count: 1012,
      icon: (
        <User2 size={20} className="text-primary-foreground dark:text-white" />
      ),
    },
    {
      title: "Total Campaigns",
      count: 123,
      icon: (
        <Plus size={20} className="text-primary-foreground dark:text-white" />
      ),
    },
  ];
  const cardItems = [
    {
      title: "NONPROFITS",
      description:
        "Nonprofits around the world apply and join Hope Horizon to access more funding.",
      icon: <HeartHandshake size={40} />,
    },
    {
      title: "DONORS",
      description:
        "People like you give to your favourite projects;you feel great when you updates about how your money is put to work by our organization.",
      icon: <HandCoins size={40} />,
    },
    {
      title: "OUR IMPACT",
      description:
        "Nonprofits have the funding they need to listen to feedback and try out new ways to work!",
      icon: <Globe2Icon size={40} />,
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <img
          src={HeroSectionBanner}
          alt="Hope Horizon Charity"
          className="
            w-full dark:opacity-40 opacity-80 h-[95vh] -z-10 object-cover "
        />
        <div
          className="absolute top-0 left-0 w-full h-full dark:opacity-5 opacity-30 "
          style={{
            background:
              "radial-gradient(86.18% 80.95% at 0% 2.02%, #6D28D9 0%, #362967 48.48%, #1F2937 100%)",
          }}
        ></div>
        <div className="absolute top-0 left-0 bg-[#1F2937] w-full h-full dark:opacity-5 opacity-[0.49]"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl md:w-[49%] max-sm:w-[60%] max-[425px]:w-[80%] comfortaa-apply text-center">
          <h4 className="leading-tight">
            Only By Helping Each Other We Can Make World Better
          </h4>
          <p className="text-xl max-md:text-base my-3 text-center">
            Urge Wealthy Environmental Harmers To Pay Up.
          </p>
          <p className="text-base max-[425px]:text-sm my-2 borel-apply text-center max-[300px]:hidden">
            Helping hands, kind hearts, changing the world.
          </p>
          {/* <Button
            variant={"outline"}
            className="bg-primary/80 dark:bg-transparent hover:bg-primary active:scale-[1.01] transition-transform duration-75 ease-in dark:hover:bg-primary/90  hover:text-primary-foreground border-primary-foreground border-2 text-2xl p-8 max-md:p-6 max-sm:text-xl"
          >
            Explore Campaigns{" "}
          </Button> */}
          <ShinyButton
            className="bg-primary/80 dark:bg-transparent hover:bg-primary dark:hover:bg-primary/90 border-2 border-primary-foreground backdrop-blur-0 text-2xl p-4 max-md:p-3 max-sm:text-xl z-20"
            onClick={() => navigate("/campaigns")}
          >
            Explore Campaigns
          </ShinyButton>
        </div>

        {/* Dot Pattern */}
        <DotPattern
          glow={false}
          className={cn(
            "[mask-image:radial-gradient(200px_circle_at_center,#6D28D9,transparent)] top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
          )}
          cr={2}
          cx={3}
          cy={3}
        />
      </div>
      <MarqueeComponent />
      <div className="max-w-7xl mx-auto rounded-md px-10 md:px-16 py-3 bg-primary dark:bg-primary/60  flex items-center justify-between max-sm:flex-wrap gap-y-5 max-sm:gap-x-5 max-[350px]:justify-center max-[350px]:flex-col">
        {stats &&
          stats.map((stat, ind) => (
            <div className="flex flex-col gap-y-2 items-center" key={ind}>
              <div className="flex gap-x-2 items-center">
                {stat.icon}
                <NumberTicker
                  value={stat.count}
                  className="whitespace-pre-wrap text-2xl font-medium tracking-tighter text-primary-foreground dark:text-white "
                />
              </div>
              <Label className="text-sm text-primary-foreground dark:text-white">
                {stat.title}
              </Label>
            </div>
          ))}
      </div>
      <h4 className="text-3xl text-center my-5 comfortaa-apply font-semibold px-3">
        How It Work?
      </h4>
      <div className="flex justify-evenly flex-wrap my-5 items-center max-[645px]:flex-col overflow-hidden gap-y-4">
        {cardItems &&
          cardItems.length > 0 &&
          cardItems.map((item, ind) => (
            <MagicCard
              className="flex-col w-1/4 max-[645px]:w-1/2 max-[500px]:w-[90%]  overflow-hidden items-center h-[200px] max-[850px]:h-[250px] justify-center p-3"
              gradientColor={theme === "light" ? "#6c28d903" : "#262626"}
              gradientFrom="#6D28D9"
              gradientTo="#FE8BBB"
              key={ind}
            >
              {item.icon}
              <h3 className="text-2xl  mt-2 comfortaa-apply font-semibold">
                {item.title}
              </h3>
              <p className="text-sm mt-2 ">{item.description}</p>
            </MagicCard>
          ))}
      </div>
      <div className="flex max-md:flex-wrap items-center max-w-7xl mx-auto my-10">
        <div className="flex items-center justify-center overflow-hidden w-[80%] p-4  box-border relative max-md:w-full">
          <img
            src={HopeHorizonLogo}
            alt="Hope Horizon"
            className="w-[380px] h-[380px] pointer-events-none"
          />
          <h4 className="text-2xl absolute top-[300px] left-1/2 transform translate-x-[-50%] translate-y-[-50%]  text-center my-5 tracking-widest  comfortaa-apply font-semibold px-3">
            HOPE HORIZON
          </h4>
        </div>
        <div className="flex flex-col justify-center overflow-hidden w-full p-4">
          <h4 className="text-xl text-start my-3 comfortaa-apply font-semibold text-primary">
            Who We are
          </h4>
          <h4 className="text-2xl text-start borel-apply italic font-semibold">
            {" "}
            Empowering Change, One Cause at a Time
          </h4>
          <p className="text-xl mt-2 ">
            <span className="font-semibold">Hope Horizon </span> is more than
            just a charity—it’s a movement. We create and manage fundraising
            events, allowing donors to contribute directly to causes they care
            about. Our platform ensures{" "}
            <span className="font-semibold">complete transparency </span>, so
            every donation goes exactly where it’s needed. By bridging the gap
            between generosity and impact, we build a future of hope and trust.
          </p>
          <Link to={"/about"} className="mt-2 text-blue-400">Learn More...</Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
