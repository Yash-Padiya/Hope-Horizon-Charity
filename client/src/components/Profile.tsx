import { useToast } from "@/hooks/use-toast";
import { UpdateSchema, UpdateState } from "@/schema/updateProfileScema";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { DockIcon, Loader2, Mail, MapPin, Phone, User2 } from "lucide-react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import ProfileSkeleton from "./Skeletons/ProfileSkeleton";
import ServerError from "./ServerError";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Link } from "react-router-dom";
import { Label } from "recharts";
function Profile() {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [inputValues, setInput] = useState<UpdateState>({
    username: "",
    address: "",
    mobile_no: "",
    aadhar_no: "",
    pan_no: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UpdateState>>({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [isFailed, setFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    setLoading(true);
    const fetchDetails = () => {
      // setAuthToken(token);
      axiosInstance
        .get(`/api/auth/fetch-details`)
        .then((res) => {
          setInput({
            username: res.data.data.username,
            address: res.data.data.address,
            mobile_no: String(res.data.data.mobile_no),
            aadhar_no: String(res.data.data.aadhar_no),
            pan_no: res.data.data.pan_no,
          });
        })
        .catch((err) => {
          setErrorMessage(
            err.message.toString() ||
              err.response.data.message.toString() ||
              "Something went wrong. Server Could not be reached."
          );
          setFailure(true);
          toast({
            variant: "destructive",
            title: `❌ Failed to load your details at this moment.`,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDetails();
  }, [token]);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({
      ...inputValues,
      [name]: value,
    });
    setIsUpdated(true);
  };
  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    const isValidated = UpdateSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<UpdateState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setUpdateLoading(true);
      setAuthToken(token);

      axiosInstance
        .put(`/api/auth/update-user/`, inputValues)
        .then((res) => {
          setInput({
            username: res.data.data.username,
            address: res.data.data.address,
            mobile_no: res.data.data.mobile_no,
            aadhar_no: res.data.data.aadhar_no,
            pan_no: res.data.data.pan_no,
          });
          toast({
            variant: "default",
            title: `✅ ${res.data.message || "Successfully Updated Profile"}`,
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: `❌ ${
              err.response.data.message || "Failed to Update Profile"
            }`,
          });
        })
        .finally(() => {
          setUpdateLoading(false);
        });
    }
  };
  if (loading) {
    return <ProfileSkeleton />;
  }
  if (isFailed) {
    return <ServerError error={errorMessage} />;
  }
  return (
    <div
      className="max-w-7xl flex py-2
    mx-auto my-3 md:h-screen overflow-hidden"
    >
      <div className="flex flex-col w-full px-3">
        <h4 className="text-2xl font-semibold comfortaa-apply my-3">Profile</h4>
        <div className="flex gap-x-8 my-4 w-1/2 items-center max-[350px]:flex-col gap-y-3 max-[350px]:w-full max-[350px]:justify-center">
          <Avatar className="w-28 h-28">
            <AvatarFallback>
              {inputValues.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h4 className="text-base font-semibold comfortaa-apply my-3 border-b-[3px] border-b-primary/45   w-fit">
                  {user?.email || "User"}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <p>You Can't Change Your Email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form className="w-full" onSubmit={handleUpdate}>
          <div className="flex flex-col gap-y-5 ">
            <div className="relative">
              <User2 className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                className={`pl-10 ${
                  errors.username
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.username}
                onChange={handleInput}
              />
              {errors && errors.username && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.username}
                </h3>
              )}
            </div>

            <div className="relative">
              <Phone className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="tel"
                name="mobile_no"
                placeholder="Phone No."
                className={`pl-10 ${
                  errors.mobile_no
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.mobile_no}
                onChange={handleInput}
              />
              {errors && errors.mobile_no && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.mobile_no}
                </h3>
              )}
            </div>
            <div className="relative">
              <MapPin className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Textarea
                name="address"
                placeholder="Address"
                className={`px-10 ${
                  errors.address
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                rows={3}
                value={inputValues.address}
                onChange={handleInput}
              />
              {errors && errors.address && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.address}
                </h3>
              )}
            </div>
            <div className="relative">
              <DockIcon className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="tel"
                name="aadhar_no"
                placeholder="Aadhar Card No."
                className={`pl-10 ${
                  errors.aadhar_no
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.aadhar_no}
                onChange={handleInput}
              />
              {errors && errors.aadhar_no && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.aadhar_no}
                </h3>
              )}
            </div>
            <div className="relative">
              <DockIcon className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="tel"
                name="pan_no"
                placeholder="Pan Card No."
                className={`pl-10 ${
                  errors.pan_no
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.pan_no}
                onChange={handleInput}
              />
              {errors && errors.pan_no && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.pan_no}
                </h3>
              )}
            </div>
          </div>
          <div className="my-5 flex max-md:flex-col gap-x-4 gap-y-3">
            {updateLoading ? (
              <Button
                className="flex gap-x-1 items-center mb-2 w-full"
                disabled
              >
                <Loader2 className="animate-spin" size={20} /> Updating....
              </Button>
            ) : (
              <>
                <Button
                  className="w-full disabled:bg-primary/50"
                  disabled={!isUpdated}
                >
                  Update
                </Button>
                <Button
                  className="w-full text-black dark:text-white bg-secondary hover:bg-secondary/80"
                  type="button"
                  disabled={!isUpdated}
                  onClick={()=> setIsUpdated(false)}
                >
                  Discard
                </Button>
              </>
            )}
          </div>
          <Link to="/auth/change-password" className="underline underline-offset-4 text-blue-400 text-sm">
            Looking to Change Password
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Profile;
