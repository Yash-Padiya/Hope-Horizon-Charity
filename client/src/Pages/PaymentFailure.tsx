import ServerError from "@/components/ServerError";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { Copy, Loader2, XCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function PaymentFailure() {
  const { txnid } = useParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    const fetchPaymentDetails = async () => {
      setLoading(true);
      axiosInstance
        .get(`/api/donations/${txnid}`)
        .then((res) => {
          setPaymentDetails(res.data.data);
        })
        .catch((err) => {
          setError(err.message.toString());
        })
        .finally(() => {
          if (paymentDetails.status == "success") {
            setError("The transaction is successful not a failure");
          }
          setLoading(false);
        });
    };
    fetchPaymentDetails();
  }, [token, txnid]);
  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  if (loading || !paymentDetails) {
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
      <div className="flex flex-col gap-2 bg-red-300/70 p-4 border border-red-500 rounded-md lg:w-1/4 w-1/2 mx-auto my-20">
        <h1 className="text-2xl font-semibold text-center">Payment Failed</h1>
        <XCircleIcon className="text-red-500 bg-white p-2 rounded-full text-center mx-auto h-32 w-32" />
        <h1 className="text-2xl font-semibold text-center">
          ₹{paymentDetails?.amount}
        </h1>
        <h4 className="text-sm font-semibold flex gap-x-2 items-center">
          Transaction ID:
          {paymentDetails?._id}
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
          Mihpayid:
          {paymentDetails?.mihpayid}
        </h4>
        <h4 className="text-sm">
          If any amount is deducted from your account, you will get refunded
          in seven working days. Appologies for the inconvinience.
        </h4>
      </div>
    </div>
  );
}

export default PaymentFailure;
