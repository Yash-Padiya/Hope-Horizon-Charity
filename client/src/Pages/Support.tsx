import { ChangeEvent, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import supportSchema, { SupportState } from "@/schema/supportSchema";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import ServerError from "@/components/ServerError";

const SupportPage = () => {
  const [inputValues, setInputValues] = useState({
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [errors, setErrors] = useState<Partial<SupportState>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidated = supportSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SupportState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .post("/api/support", inputValues)
        .then((res) => {
          toast({
            variant: "default",
            title: `${res.data.message || "Feedback Submitted"} `,
          });
        })
        .catch((err) => {
            setErrors(err.message.toString());
          toast({
            variant: "destructive",
            title: `✖ ${
              err.response.data.message ||
              "Something went wrong. Please try again later."
            }`,
          });
        })
        .finally(() => {
          setLoading(false);
          setInputValues({
            query: "",
          });
        });
    }
  };
  if (!user) {
    toast({
      variant: "destructive",
      title: "Must be logged in to support",
    });
    navigate("/auth/login");
    return null;
  }
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full  max-w-lg p-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-center mb-4">
            Are you in trouble?
          </h2>
          <h2 className="text-xl font-semibold text-center mb-4">
            Contact Support Now
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="querymsg">Your Query</Label>
              <Textarea
                id="querymsg"
                name="query"
                placeholder="Describe your issue..."
                value={inputValues.query}
                onChange={handleInput}
                required
                className={`mt-2 ${
                  errors.query
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
