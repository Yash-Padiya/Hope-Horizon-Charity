import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { SignUpSchema, RegistrationState } from "@/schema/signupSchema";
import { RootState } from "@/store/store";
import {
  DockIcon,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  User2,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";

function AddUser({
  open,
  setOpen,
  setDonors,
}: {
  open: boolean;
  setOpen: any;
  setDonors: any;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { toast } = useToast();
  const [inputValues, setInput] = useState<RegistrationState>({
    username: "",
    email: "",
    password: "",
    mobile_no: "",
    aadhar_no: "",
    pan_no: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationState>>({});
  const [showPassword, setShowPassword] = useState(false);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({ ...inputValues, [name]: value });
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const isValidated = SignUpSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<RegistrationState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .post("/api/auth/add-donor", inputValues)
        .then((res) => {
          setDonors((donors: any)=>[res.data.data,...donors].slice(0,10));
          toast({
            variant: "default",
            title: `✅ ${res.data.message || "Successfully Added Donor"}`,
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: `❌ ${err.response.data.message || "Failed to Add Donor"}`,
          });
        })
        .finally(() => {
          setLoading(false);
          setInput({
            username: "",
            email: "",
            password: "",
            mobile_no: "",
            aadhar_no: "",
            pan_no: "",
            address: "",
          });
          setOpen(false);
        });
    }
  };
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="flex justify-between items-center">
              Add Donor
              <DrawerClose>
                <X />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              This action is performed by admin after veryfying the donor
              details physically.
            </DrawerDescription>
          </DrawerHeader>
          <form className="mx-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-3 ">
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
                <Mail className="absolute top-2 left-1 pointer-events-none text-gray-500" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`pl-10 ${
                    errors.email
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.email}
                  onChange={handleInput}
                />
                {errors && errors?.email && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.email}
                  </h3>
                )}
              </div>
              <div className="relative">
                <LockKeyhole className="absolute top-2 left-1 pointer-events-none text-gray-500" />

                <button
                  type="button"
                  className="p-0 absolute top-3 right-3 text-gray-500 cursor-pointer z-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
                </button>

                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`px-10 ${
                    errors.password
                      ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                      : "focus-visible:ring-1"
                  }`}
                  value={inputValues.password}
                  onChange={handleInput}
                />
                {errors && errors.password && (
                  <h3 className="text-xs text-start mt-1 text-red-500">
                    {errors.password}
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
            <DrawerFooter className="px-0">
              {loading ? (
                <Button
                  className="flex gap-x-1 items-center mb-2 w-full"
                  disabled
                >
                  <Loader2 className="animate-spin" size={20} /> Adding....
                </Button>
              ) : (
                <Button className="w-full">Add Donor</Button>
              )}
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default AddUser;
