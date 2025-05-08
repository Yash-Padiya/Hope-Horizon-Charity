import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LogInSchema, LoginState } from "@/schema/loginSchema";
import { loginUser } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.auth.loading.login);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValues, setInput] = useState<LoginState>({
    email: "",
    password: "",
  });
  // This loading and user states are only for demo purpose changes will be made when authentication is implemented
  const [errors, setErrors] = useState<Partial<LoginState>>({});
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({ ...inputValues, [name]: value });
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const isValidated = LogInSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      // console.log(inputValues);
      const result = await dispatch(loginUser(inputValues));
      if(loginUser.rejected.match(result)){
        setInput({
          email: "",
          password: "",
        })
        toast({
          variant: "destructive",
          title: `✖ ${result.payload}`,
        })
      }
      if (loginUser.fulfilled.match(result)) {
        toast({
          variant: "default",
          title: `✅ Logged In Successfully`,
        })
        window.history.back()
        
      }
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <form
          className="md:p-8 w-full md:border border-gray-200 max-w-md rounded-lg mx-4"
          onSubmit={handleSubmit}
        >
          <h3 className="text-4xl font-bold">
            Hope Horizon Charity
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-2">
            Philanthropy with purpose, kindness with impact.
          </p>
          <div className="mt-4 flex flex-col gap-y-3">
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
                className={`pl-10 ${
                  errors.password
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.password}
                onChange={handleInput}
              />
              {errors && errors?.password && (
                <h3 className="text-xs text-start mt-2 text-red-500">
                  {errors.password}
                </h3>
              )}
            </div>
            {isLoading ? (
              <Button className="flex gap-x-1 items-center mb-1" disabled>
                <Loader2 className="animate-spin" size={20} /> Please Wait
              </Button>
            ) : (
              <Button className="mb-1">Login</Button>
            )}
            {/* <h3 className="font-semibold text-blue-600 text-start  underline">
              <Link to={"/reset/changepassword"}>Forgot Password</Link>
            </h3> */}
            <Separator />
          </div>
          <h3 className="font-semibold text-gray-600 mt-4 text-start">
            Want to become a donor?{" "}
            <Link to={"/auth/signup"}>
              <span className="underline active:text-blue-600">
                Create a new account now{" "}
              </span>
            </Link>
          </h3>
          <h3 className="font-semibold text-gray-600 mt-1 text-start">
            It takes less than a minute.
          </h3>
        </form>
      </div>
    </>
  );
}

export default Login;
