import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { Loader2, Trash2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { ReportContent } from "@/utils/pdfUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ServerError from "@/components/ServerError";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";

function Dashboard() {
  const [donations, setDonations] = useState<any>([]);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [timeframe, setTimeframe] = useState("monthly");
  const [status, setStatus] = useState("success");
  const contentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string>("");
  const [idToDelete, setID] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [removeLoading, setremoveLoading] = useState(false);
  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    fetchDonations();
  }, [token, timeframe, status]);
  useEffect(() => {
    if (!chartRef.current) return;
    captureChartImage();
  }, [timeframe, chartRef.current]);
  const fetchDonations = async () => {
    setLoading(true);
    axiosInstance
      .get("/api/donations/get-all/donations", {
        params: {
          timeframe: timeframe,
          status,
        },
      })
      .then((res) => {
        setDonations(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        setError(err.message.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterChange = (value: string) => {
    setTimeframe(value);
  };
  const handleStatus = (value: string) => {
    setStatus(value);
  };
  const handleDelete = async (id: string | null) => {
    if (!id) return;
    setremoveLoading(true);
    await axiosInstance
      .delete(`/api/donations/remove`, {
        params: {
          donationId: id,
        },
      })
      .then((res) => {
        setFilteredData(
          filteredData.filter(
            (donation: any) => donation._id !== res.data.data._id
          )
        );

        toast({
          variant: "default",
          title: `✅ ${res.data.message || "Successfully Deleted Donation"}`,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ ${err.response.data.message || "Failed to Remove Event"}`,
        });
      })
      .finally(() => {
        setremoveLoading(false);
        setOpen(false);
      });
  };
  const captureChartImage = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    setChartImage(canvas.toDataURL("image/png"));
  };
  const generateReport = useReactToPrint({
    contentRef,
    documentTitle: `Donation_Report_${timeframe}`,
  });

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
  if (
    !loading &&
    !error &&
    donations.length == 0 && (
      <h3 className="text-2xl text-center mt-10 text-secondary-foreground">
        Currently there are no donations.
      </h3>
    )
  )
    if (error) {
      return <ServerError error={error} />;
    }
  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Admin Donation Dashboard</h2>
        <Button
          onClick={generateReport}
          disabled={status === "success" ? false : true}
        >
          Generate Report
        </Button>
      </div>

      <Select onValueChange={handleFilterChange} value={timeframe}>
        <SelectTrigger>
          <SelectValue placeholder="Select Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="thisWeek">This Week</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
          <SelectItem value="annually">Annually</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-full h-80" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData.map((donation: any) => ({
              name: new Date(donation.donation_date).toLocaleDateString(),
              amount: donation.amount,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#134E78"
              fill="#134E78"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="max-w-full flex items-center gap-x-5 my-3">
        <h4 className="text-lg w-1/2">Select Payment Status:</h4>
        <Select onValueChange={handleStatus} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((donation: any) => (
            <TableRow key={donation._id}>
              <TableCell>{donation.user?.username || "N/A"}</TableCell>
              <TableCell>{donation.event?.Event_name || "N/A"}</TableCell>
              <TableCell>₹ {donation.amount}</TableCell>
              <TableCell>
                {new Date(donation.donation_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{donation?.status}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setID(donation._id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete donation?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete
              donation account and remove donation data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant={"destructive"}
            onClick={() => handleDelete(idToDelete)}
          >
            {removeLoading ? "Removing..." : "Remove"}
          </Button>
        </DialogContent>
      </Dialog>
      <div className="hidden">
        <ReportContent
          filteredData={filteredData}
          timeframe={timeframe}
          receiptRef={contentRef}
          chartImage={chartImage}
        />
      </div>
    </div>
  );
}

export default Dashboard;
