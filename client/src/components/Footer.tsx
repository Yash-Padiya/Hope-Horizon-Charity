import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import HopeHorizonLogo from "../assets/logo-removebg-preview.png";
import ISOLogo from "../assets/iso.png";

export default function Footer() {
  return (
    <footer className="py-10">
      <Separator />
      <div className="max-w-7xl flex items-center my-2 mx-auto justify-between max-md:flex-wrap p-2 gap-y-5">
        {/* Logo & About */}
        <div className="flex flex-col items-center justify-center max-md:w-full">
          <div className="flex gap-x-2 items-center">
            <img
              src={HopeHorizonLogo}
              alt="Hope Horizon Logo"
              className="h-16 w-16"
            />
            <h2 className="text-2xl flex flex-col font-bold tracking-wide comfortaa-apply gap-y-0">
              Hope Horizon
              <span className="text-[12px] text-center">
                Charity & Fundraising
              </span>
            </h2>
          </div>
          <div>
          <h3 className="text-sm justify-self-center text-secondary-foreground/70 text-center mt-4 font-semibold  w-[80%] overflow-hidden">
            Address: 101/102, B-Block, Avenue Shilp, 132 feet ring road, Paldi, Ahmedabad, Gujarat, India
          </h3>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center gap-y-2 max-md:w-full">
          <h3 className="text-lg font-semibold">Quick Links</h3>

          <Link
            to="/"
            className="text-gray-800 dark:text-gray-400 hover:text-white"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-gray-800 dark:text-gray-400 hover:text-white"
          >
            About
          </Link>

          <Link
            to="/campaigns"
            className="text-gray-800 dark:text-gray-400 hover:text-white"
          >
            Active Campaigns
          </Link>
        </div>

        {/* Social Media & Call-to-Action */}
        <div className="max-md:w-full flex flex-col gap-y-2 items-center">
          <h3 className="text-base font-semibold md:self-start">
            Having trouble donating?
          </h3>
          <h3 className="text-base font-semibold md:self-start">Connect With Us</h3>
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-lg md:text-xl font-semibold flex gap-x-2 items-center">
              <Phone size={24} />
              +91 079 1234 5678
            </h3>
            <h3 className="text-lg md:text-xl font-semibold flex gap-x-2 items-center">
              <Mail size={24} />
              donate@hopehorizon.org
            </h3>
            <h3 className="text-lg md:text-xl font-semibold flex gap-x-2 items-center">
              <Mail size={24} />
              helpdesk247@hopehorizon.org
            </h3>
          </div>
        </div>
      </div>
      <div className="flex max-md:flex-col items-center justify-between max-w-7xl mx-auto gap-y-5 p-3 mt-4">
        <div className="flex items-center max-md:justify-center gap-x-3 w-full">
          <img
            src={ISOLogo}
            alt="ISO Certified Organization"
            className="h-16 w-16 rounded-full"
          />
          <h3 className="text-lg dark:text-secondary-foreground/40">
            ISO Certified Organization.
          </h3>
        </div>
        <div className="flex-col gap-y-3 max-md:text-center w-full">
          <h3 className="text-base   dark:text-secondary-foreground/40">
            Registered under the Indian Trust Act ,1882
          </h3>
          <h3 className="text-base   dark:text-secondary-foreground/40">
            Registered trust number: EMA/234/AHMEDABAD/GJ/IND
          </h3>
        </div>
      </div>
      <Separator className="w-[60%] rounded mx-auto mt-3" />
      {/* Copyright */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm  pt-5">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold"> Hope Horizon. </span> All Rights
        Reserved.
      </div>
    </footer>
  );
}
