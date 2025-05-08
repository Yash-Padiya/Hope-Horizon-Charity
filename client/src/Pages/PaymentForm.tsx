import React, { ChangeEvent, useEffect, useState } from "react";
import PayuLogo from "../assets/payulogo.png";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PaymentSchema, PaymentState } from "@/schema/paymentSchema";
import { useParams } from "react-router-dom";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import {
  IndianRupee,
  Loader2,
  Mail,
  MessageCircleHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SubmitForm from "@/components/SubmitForm";
function PaymentForm() {
  // 5118-7000-0000-0003	
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [errors, setErrors] = useState<Partial<PaymentState>>({});
  const [htmlForm, setHtmlForm] = useState<string>("");
  const { toast } = useToast();
  const [paymentvalues, setPayment] = useState<PaymentState>({
    eventId: id!,
    amount: 1,
    message: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setFetchLoading(true);
      axiosInstance
        .get(`/api/events/find/${id}`)
        .then((res) => {
          setEvent(res.data.data);
        })
        .catch((err) => {
          setErrors(err.message.toString());
        })
        .finally(() => {
          setFetchLoading(false);
        });
    };
    fetchEvent();
  }, [id]);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // setPayment({ ...paymentvalues,
    //   [name]: name === "amount" ? Number(value) : value });
    if (name === "amount") {
      // Convert to number and check if it's a valid number
      const parsedValue = parseFloat(value);

      // If parsedValue is a valid number (not NaN) and greater than or equal to 1, update state
      setPayment({
        ...paymentvalues,
        [name]:
          !isNaN(parsedValue) && parsedValue >= 0
            ? parsedValue
            : paymentvalues.amount, // Default to previous value if invalid
      });
    } else {
      setPayment({ ...paymentvalues, [name]: value });
    }
  };
  const handlePayment = (event: React.FormEvent) => {
    event.preventDefault();
    const isValidated = PaymentSchema.safeParse(paymentvalues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<PaymentState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .post("/api/donations/", paymentvalues)
        .then((res) => {
          setHtmlForm(res.data.formHtml);
          
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant : "destructive",
            title: `✖ ${err.response.data.message || "Something went wrong. Please try again later."}`
          })
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
            setPayment({
              eventId: id!,
              amount: 1,
              message: "",
            });
          }, 3000);
        });
    }
  };
  return (
    // PayU Payment Gateway building better payment experiences
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-2 items-center  max-md:flex-col-reverse">
      <div className="w-full flex flex-col justify-center items-center p-3 ">
        <h5 className="text-base self-start font-semibold text-secondary-foreground my-3">
          Powered by,
        </h5>
        <img src={PayuLogo} alt="" className="w-[300px] " />
        <h4 className="text-xl font-semibold my-3 comfortaa-apply">
          <span className="text-[#00ad7d] font-extrabold">PayU </span> Payment
          Gateway building better payment experiences.
        </h4>
      </div>
      <div className="w-full flex justify-center items-center p-3 rounded-md border border-secondary-foreground/30 flex-col">
        <h4 className="text-xl font-semibold my-3 comfortaa-apply text-wrap">
          <span className="text-primary text-2xl">
            Thank You, {user?.username}
          </span>{" "}
          for becoming someone's We 😍.
        </h4>
        <div className="w-full flex items-center gap-x-3">
          <img
            src={event?.coverPhotoHighQuality}
            alt="Event Cover Photo"
            className="w-[150px] h-[150px] rounded-md"
          />
          <div className="flex gap-2 items-center flex-col">
            <h4 className="text-xl font-semibold">{event?.Event_name}</h4>
            <h4 className="text-base font-semibold p-2 border border-secondary-foreground/40 rounded-md flex gap-x-2 items-center">
              <Mail size={16} />
              {user?.email}
            </h4>
          </div>
        </div>
        <form className="w-full my-5" onSubmit={handlePayment}>
          <div className="flex flex-col gap-y-3 ">
            <div className="relative">
              <IndianRupee className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="text"
                name="amount"
                placeholder="₹ 0"
                className={`pl-10 ${
                  errors.amount
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={paymentvalues.amount}
                onChange={handleInput}
              />
              {errors && errors.amount && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.amount}
                </h3>
              )}
            </div>
            <div className="relative">
              <MessageCircleHeart className="absolute top-2 left-1 pointer-events-none text-gray-500" />
              <Input
                type="text"
                name="message"
                placeholder="(optional message)"
                className={`pl-10 ${
                  errors.message
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={paymentvalues.message}
                onChange={handleInput}
              />
              {errors && errors?.message && (
                <h3 className="text-xs text-start mt-1 text-red-500">
                  {errors.message}
                </h3>
              )}
            </div>
          </div>
          <div className="my-3">
            {loading ? (
              <Button
                className="flex gap-x-1 items-center mb-2 w-full"
                disabled
              >
                <Loader2 className="animate-spin" size={20} /> Redirecting....
              </Button>
            ) : (
              <Button className="w-full flex items-center gap-x-2">
                <IndianRupee />
                DONATE
              </Button>
            )}
          </div>
        </form>
      </div>
      {htmlForm && htmlForm !== "" && (
        <SubmitForm formHtml={htmlForm} />
      )}
    </div>
  );
}

export default PaymentForm;
