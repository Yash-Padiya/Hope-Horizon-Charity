import ShowSupport from "@/components/Admin/ShowSupport";
import Pagination from "@/components/Pagination";
import ServerError from "@/components/ServerError";
import SkeletonHCV from "@/components/Skeletons/SkeletonHCV";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { HelpCircle, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function HelpCenter() {
  const [supportReqs, setSupportReq] = useState<any>([]);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reqStatus, setReqStatus] = useState("pending");
  useEffect(() => {
    const loadRequests = async () => {
      if (!token) return;
      console.log("reqStatus", reqStatus);
      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .get("/api/support", {
          params: {
            page: currentPage,
            limit: 10,
            status: reqStatus
          },
        })
        .then((res) => {
          setSupportReq(res.data.data);
          console.log(res.data.data);
          setTotalPages(res.data.pagination.totalPages);
        })
        .catch((err) => {
          setError(
            err.message.toString() ||
              err.response.data.message.toString() ||
              "Something went wrong. Server could not be reached."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadRequests();
  }, [currentPage, reqStatus]);
  const handleUpdate = (id: string, updateTo: string) => {
    if (!token) return;
    setRemoveLoading(true);
    setAuthToken(token);
    axiosInstance
      .put(`/api/support/set-status/${id}`, { status: updateTo })
      .then((res) => {
        const updatedReqs = supportReqs.filter((supportReq: any) => supportReq._id !== id);
        setSupportReq(updatedReqs);
        toast({
          variant: "default",
          title: `✅ ${res.data.message || "Successfully updated"}`,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ ${err.response.data.message || "Failed to update"}`,
        });
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  };
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
  return (
    <div className="max-w-full overflow-hidden py-8 md:py-4 px-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-x-2">
          <HelpCircle /> Help Center
        </h3>
      </div>
      <div className="flex items-center justify-end gap-x-3">
        <h4 className="flex gap-x-2 font-semibold items-center">
          <ListFilter size={20} /> Sort
        </h4>
        <div className="w-32">
        <Select onValueChange={(value) => setReqStatus(value)} >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending" defaultChecked={true}>Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
      {loading && <SkeletonHCV />}
      {!loading && supportReqs && supportReqs.length > 0 && (
        <ShowSupport
          supportReqs={supportReqs}
          handleUpdate={handleUpdate}
          removeLoading={removeLoading}
        />
      )}
      {!loading && !error && supportReqs.length === 0 && (
        <h3 className="text-xl font-bold text-center">{`No ${reqStatus} support requests`}</h3>
      )}
      {error && <ServerError error={error} />}
      {!loading && supportReqs && supportReqs.length > 0 && (
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

export default HelpCenter;
