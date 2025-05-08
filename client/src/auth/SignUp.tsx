import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SignUpSchema, RegistrationState } from "@/schema/signupSchema";
import { registerUser } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
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
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const { toast } = useToast()
  const [inputValues, setInput] = useState<RegistrationState>({
    username: "",
    email: "",
    password: "",
    mobile_no: "",
    aadhar_no: "",
    pan_no: "",
    address: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(
    (state: RootState) => state.auth.loading.register
  );
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
      const result = await dispatch(registerUser(inputValues));
      if(registerUser.rejected.match(result)){
        toast({
          variant: "destructive",
          title: `❌ ${result.payload}`,
        })
        setInput({
          username: "",
          email: "",
          password: "",
          mobile_no: "",
          aadhar_no: "",
          pan_no: "",
          address: "",
        });
      }
      if (registerUser.fulfilled.match(result)) {
        toast({
          variant: "default",
          title: `✅ Registration Successful, You have been logged in`,
        })
        navigate("/");
      }
      // console.log(inputValues);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <form
          className="md:p-8 w-full md:border border-gray-200 max-w-md rounded-lg mx-4"
          onSubmit={handleSubmit}
        >
          <h3 className="text-3xl font-bold">Sign Up</h3>
          <p className="text-gray-500 text-sm italic mt-2">
            Together in kindness, united in philanthropy, helping others.
          </p>
          <div className="mt-4 flex flex-col gap-y-3">
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
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                  errors.password
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                rows={3}
                value={inputValues.address}
                onChange={handleInput}

              />
              {/* <textarea
                placeholder="Address"
                name="address"
                className={`${
                  errors.address
                    ? "border-2 border-red-500 text-base w-full rounded-md py-2 pl-10 resize-none text-gray-900 bg-transparent "
                    : "border border-gray-200  text-base w-full rounded-md py-2 focus:border-2 focus:border-gray-600 focus:outline-none text-gray-900 resize-none pl-10 bg-transparent"
                }`}
                onChange={handleInput}
                value={inputValues.address}
              ></textarea> */}
              {errors && errors.address && (
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                <h3 className="text-xs text-start mt-2 text-red-500">
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
                value={inputValues.pan_no.toUpperCase()}
                onChange={handleInput}
              />
              {errors && errors.pan_no && (
                <h3 className="text-xs text-start mt-2 text-red-500">
                  {errors.pan_no}
                </h3>
              )}
            </div>
            {isLoading ? (
              <Button className="flex gap-x-1 items-center mb-2" disabled>
                <Loader2 className="animate-spin" size={20} /> Please Wait
              </Button>
            ) : (
              <Button className="mb-2">Sign Up</Button>
            )}
            <Separator />
          </div>
          <h3 className="font-semibold text-gray-600 mt-4 text-start">
            Already have an account?{" "}
            <Link to={"/auth/login"}>
              <span className="underline active:text-blue-600">Login</span>
            </Link>
          </h3>
        </form>
      </div>
    </>
  );
}

export default SignUp;
