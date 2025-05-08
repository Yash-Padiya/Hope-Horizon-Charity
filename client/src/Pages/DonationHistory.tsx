import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import DonationReceipt from "@/utils/pdfUtils";
import DonationHistorySkeleton from "@/components/Skeletons/DHSkeleton";
import ServerError from "@/components/ServerError";
import Pagination from "@/components/Pagination";
import { useNavigate } from "react-router-dom";

export default function DonationHistory() {
  const [donations, setDonations] = useState<any>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [errors, setErrors] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if(user?.user_type === "admin") return
    if (!token) return;
    const fetchDonations = async () => {
      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .get("/api/donations/find/my-donations", {
          params: {
            page: currentPage,
            limit: 10,
          },
        })
        .then((res) => {
          setDonations(res.data.data); // Assuming `setDonations` updates the state
          setTotalPages(res.data.pagination.totalPages);
        })
        .catch((err) => {
          setErrors(err.message.toString());
          toast({
            variant: "destructive",
            title: `✖ ${
              err.response?.data?.message ||
              "Something went wrong. Please try again later."
            }`,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDonations();
  }, [token, currentPage]);
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Donation_Receipt_${selectedDonation?._id}`,
  });
  if (!user || user.user_type === "admin") {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <p className="text-center text-lg">
          🚀 <strong>Only registered Donors can view donation history</strong>
          <br /> <Button onClick={() => navigate("/auth/login")}>Sign In as donor</Button>
        </p>
      </div>
    );
  }
  if (loading) {
    return <DonationHistorySkeleton />;
  }
  if (errors) {
    return <ServerError error={errors} />;
  }
  if (!loading && !errors && donations.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-center text-lg">
          🚀 <strong>No Donation History Yet!</strong>
          <br /> You have not donated in any event.
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Donation History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation: any) => (
            <TableRow key={donation._id}>
              <TableCell>
                {new Date(donation.donation_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{donation.event.Event_name}</TableCell>
              <TableCell>₹ {donation.amount.toFixed(2)}</TableCell>
              <TableCell>{donation.status}</TableCell>
              <TableCell>
                {donation.status === "success" ? (
                  <Button
                    onClick={() => {
                      setSelectedDonation(donation);
                      setTimeout(() => handlePrint(), 300); // Ensure the state updates before printing
                    }}
                  >
                    Download Receipt
                  </Button>
                ) : (
                  <p className="bg-red-600 rounded-full text-white py-1 px-6 w-fit">
                    Failed
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Hidden Receipt Component for Printing */}
      <div className="hidden">
        {selectedDonation && (
          <DonationReceipt
            transactionDetails={selectedDonation}
            receiptRef={contentRef}
          />
        )}
      </div>
      {!loading && donations && donations.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
