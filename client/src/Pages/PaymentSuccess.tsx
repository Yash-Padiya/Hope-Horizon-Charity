import ServerError from "@/components/ServerError";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import feedbackSchema, { FeedbackState } from "@/schema/feedbackSchema";
import { closeFeedbackDrawer, openFeedbackDrawer } from "@/store/feedbackSlice";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { isTargetDateWithinFourMinutes } from "@/utils/helpers";
import DonationReceipt from "@/utils/pdfUtils";
import {
  CheckCircleIcon,
  Copy,
  CopyCheckIcon,
  Loader2,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function PaymentSuccess() {
  const { txnid } = useParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const feedbackDrawer = useSelector(
    (state: RootState) => state.feedback.feedbackDrawer
  );
  const dispatch = useDispatch();
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [FLoading, setFLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    // contentRef: () => receiptRef.current,
    // documentTitle: `Donation_Receipt_${paymentDetails._id}`,
    contentRef,
    documentTitle: `Donation_Receipt_${paymentDetails._id}`,
  });

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    const fetchPaymentDetails = async () => {
      setLoading(true);
      axiosInstance
        .get(`/api/donations/${txnid}`)
        .then((res) => {
          setPaymentDetails(res.data.data);
          dispatch(openFeedbackDrawer())
        })
        .catch((err) => {
          setError(err.message.toString());
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchPaymentDetails();
  }, [token, txnid]);
  useEffect(() => {
    if (paymentDetails?.event?._id) {
      setInputValues((prev) => ({
        ...prev,
        eventId: paymentDetails.event._id, // Set eventId when paymentDetails is available
      }));
    }
  }, [paymentDetails]);

  const handleDrawerClose = () => dispatch(closeFeedbackDrawer());
  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };
  const [inputValues, setInputValues] = useState<FeedbackState>({
    eventId: "",
    ratings: 0,
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FeedbackState>>({});
  const handleStarClick = (value: number) => {
    setInputValues((prev) => ({ ...prev, ratings: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidated = feedbackSchema.safeParse(inputValues);
    if (!isValidated.success) {
      const fieldErrors = isValidated.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<FeedbackState>);
      return;
    }
    if (isValidated.success) {
      setErrors({});
      setFLoading(true);
      setAuthToken(token);
      axiosInstance
        .post("/api/feedbacks/", inputValues)
        .then((res) => {
          toast({
            variant: "default",
            title: `${res.data.message || "Feedback Submitted"} `,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            title: `✖ ${
              err.response.data.message ||
              "Something went wrong. Please try again later."
            }`,
          });
        })
        .finally(() => {
          setFLoading(false);
          dispatch(closeFeedbackDrawer());
        });
    }
  };
  if (loading) {
    return (
      <div className="w-full h-screen relative ">
        <Loader2
          className="animate-spin dark:text-primary fixed top-1/3 left-1/2"
          size={70}
        />
      </div>
    );
  }
  if (error) {
    return <ServerError error={error} />;
  }
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-2 bg-green-300/70 p-4 border border-green-500 rounded-md lg:w-1/4 w-1/2 mx-auto my-20">
        <h1 className="text-2xl font-semibold text-center">
          Payment Successful
        </h1>
        <CheckCircleIcon className="text-green-500 bg-white p-2 rounded-full text-center mx-auto h-32 w-32" />
        <h1 className="text-2xl font-semibold text-center">
          ₹ {paymentDetails?.amount}
        </h1>
        <h4 className="text-sm font-semibold flex gap-x-2 items-center">
          Transaction ID: {paymentDetails?._id}{" "}
          {copied ? (
            <CopyCheckIcon size={16} />
          ) : (
            <Copy
              size={16}
              onClick={() => copyToClipboard(paymentDetails?._id)}
              className="cursor-pointer"
            />
          )}
        </h4>
        <h4 className="text-sm font-semibold">
          Mihpayid: {paymentDetails?.mihpayid}{" "}
        </h4>
        <h4 className="text-sm">
          Thank you for contributing to our organization.
        </h4>
        <Button
          className="bg-green-800 hover:bg-green-800/90"
          onClick={handlePrint}
        >
          Download Receipt
        </Button>
        {paymentDetails.status == "success" && (
          <div className="hidden">
            <DonationReceipt
              transactionDetails={paymentDetails}
              receiptRef={contentRef}
            />
          </div>
        )}
      </div>
      <Drawer open={feedbackDrawer} onOpenChange={handleDrawerClose}>
        <DrawerContent className="max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="flex justify-between items-center">
              Provide Feedback
              <DrawerClose>
                <X />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              Please help us to improve our service by giving your valuable
              feedback.
            </DrawerDescription>
          </DrawerHeader>
          <form className="mx-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-3">
              {/* Star Rating */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer ${
                      inputValues.ratings >= star
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
              {errors && errors?.ratings && (
                <h3 className="text-xs text-start text-red-500">
                  {errors.ratings}
                </h3>
              )}

              {/* Feedback Description */}
              <Textarea
                name="description"
                placeholder="Write your feedback here..."
                className={`${
                  errors.description
                    ? "focus-visible:ring-2 border-red-500 border-2 focus-visible:border-0 focus-visible:ring-red-500"
                    : "focus-visible:ring-1"
                }`}
                value={inputValues.description}
                onChange={handleInputChange}
              />
              {errors && errors?.description && (
                <h3 className="text-xs text-start  text-red-500">
                  {errors.description}
                </h3>
              )}
              {errors && errors?.eventId && (
                <h3 className="text-xs text-start  text-red-500">
                  {errors.eventId}
                </h3>
              )}
            </div>

            <DrawerFooter className="px-0">
              {FLoading ? (
                <Button
                  className="flex gap-x-1 items-center mb-2 w-full"
                  disabled
                >
                  <Loader2 className="animate-spin" size={20} /> Submitting...
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Give Feedback
                </Button>
              )}
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default PaymentSuccess;
