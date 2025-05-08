import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChangePasswordSchema, {
  ChangePasswordState,
} from "@/schema/changePassSchema";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [inputValues, setInput] = useState<ChangePasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ChangePasswordState>>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({
      ...inputValues,
      [name]: value,
    });
  };
  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    const isValidated = ChangePasswordSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<ChangePasswordState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setUpdateLoading(true);
      setAuthToken(token);

      axiosInstance
        .put(`/api/auth/change-password/`, { ...inputValues, email: user?.email })
        .then((res) => {
          toast({
            variant: "default",
            title: `✅ ${res.data.message || "Successfully Updated Password"}`,
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: `❌ ${
              err.response.data.message || "Failed to Update Password"
            }`,
          });
        })
        .finally(() => {
          setUpdateLoading(false);
          setInput({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          })
        });
    }
  };
  return (
    <div
      className="max-w-7xl flex flex-col py-2
    mx-auto my-6 md:h-screen overflow-hidden items-center"
    >
      <h4 className="text-2xl font-semibold comfortaa-apply my-5 px-0">
        Change Password
      </h4>
      <form className="sm:w-1/2 w-full max-sm:px-8" onSubmit={handleUpdate}>
        <div className="flex flex-col gap-y-5 ">
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
              name="currentPassword"
              placeholder="Current Password"
              className={`px-10 ${
                errors.currentPassword
                  ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                  : "focus-visible:ring-1"
              }`}
              value={inputValues.currentPassword}
              onChange={handleInput}
            />
            {errors && errors.currentPassword && (
              <h3 className="text-xs text-start mt-1 text-red-500">
                {errors.currentPassword}
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
              name="newPassword"
              placeholder="Enter New Password"
              className={`px-10 ${
                errors.newPassword
                  ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                  : "focus-visible:ring-1"
              }`}
              value={inputValues.newPassword}
              onChange={handleInput}
            />
            {errors && errors.newPassword && (
              <h3 className="text-xs text-start mt-1 text-red-500">
                {errors.newPassword}
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
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              className={`px-10 ${
                errors.confirmNewPassword
                  ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                  : "focus-visible:ring-1"
              }`}
              value={inputValues.confirmNewPassword}
              onChange={handleInput}
            />
            {errors && errors.confirmNewPassword && (
              <h3 className="text-xs text-start mt-1 text-red-500">
                {errors.confirmNewPassword}
              </h3>
            )}
          </div>
          <div className="my-5 flex max-md:flex-col gap-x-4 gap-y-3">
            {updateLoading ? (
              <Button
                className="flex gap-x-1 items-center mb-2 w-full"
                disabled
              >
                <Loader2 className="animate-spin" size={20} /> Please wait....
              </Button>
            ) : (
              <>
                <Button className="w-full disabled:bg-primary/50">
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
