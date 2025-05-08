import AddVolunteer from "@/components/Admin/AddVolunteer";
import ShowVolunteers from "@/components/Admin/ShowVolunteers";
import Pagination from "@/components/Pagination";
import ServerError from "@/components/ServerError";
import SkeletonHCV from "@/components/Skeletons/SkeletonHCV";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { ListFilter, PersonStanding, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function VolunteerDashboard() {
  const [volunteers, setVolunteers] = useState<any>([]);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [reqStatus, setReqStatus] = useState("active");

  useEffect(() => {
        const loadVolunteers = async () => {
          if (!token) return;
    
          setLoading(true);
          setAuthToken(token);
          axiosInstance
            .get("/api/volunteers", {
              params: {
                page: currentPage,
                limit: 10,
                sortAs : reqStatus
              },
            })
            .then((res) => {
              setVolunteers(res.data.data);
              setTotalPages(res.data.pagination.totalPages);
            })
            .catch((err) => {
              setError(
                err.message.toString() ||
                  err.response.data.message.toString() ||
                  "Something went wrong. Server Could not be reached."
              );
            })
            .finally(() => {
              setLoading(false);
            });
        };
        loadVolunteers();
      }, [currentPage,reqStatus]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleRemove = (id: string) => {
    if (!token) return;
        setRemoveLoading(true);
        setAuthToken(token);
        axiosInstance
          .delete(`/api/volunteers/${id}`)
          .then((res) => {
            const updatedVolunteers = volunteers.filter((volunteer: any) => volunteer._id !== id);
            setVolunteers(updatedVolunteers);
            toast({
              variant: "default",
              title: `✅ ${res.data.message || "Successfully Removed Donor"}`,
            });
          })
          .catch((err) => {
            toast({
              variant: "destructive",
              title: `❌ ${err.response.data.message || "Failed to Remove Donor"}`,
            });
          })
          .finally(() => {
            setRemoveLoading(false);
          });
  };
  const handleMarkLeft = (id: string) => {
    if (!token) return;
    setRemoveLoading(true);
    setAuthToken(token);
    axiosInstance
      .patch(`/api/volunteers/mark-left/${id}`)
      .then((res) => {
        const updatedVolunteers = volunteers.filter((volunteer: any) => volunteer._id !== id);
        setVolunteers(updatedVolunteers);
        toast({
          variant: "default",
          title: `✅ ${res.data.message || "Marked Volunteer as Left"}`,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ ${err.response.data.message || "Failed to Mark Volunteer as Left"}`,
        });
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  }
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <div className="max-w-full overflow-hidden py-8 md:py-4 px-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-x-2">
          <PersonStanding /> Volunteer Dashboard
        </h3>
        <Button
          className="bg-primary rounded-full flex items-center gap-x-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus />
          Add Volunteer
        </Button>
      </div>
      <div className="flex items-center justify-end gap-x-3 my-3">
        <h4 className="flex gap-x-2 font-semibold items-center">
          <ListFilter size={20} /> Sort
        </h4>
        <div className="w-32">
        <Select onValueChange={(value) => setReqStatus(value)} >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" defaultChecked={true}>Active Volunteers</SelectItem>
            <SelectItem value="left">Left Volunteers</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
      <AddVolunteer open={isOpen} setOpen={setIsOpen} setVolunteers={setVolunteers} />
      {loading && <SkeletonHCV />}
      {!loading && volunteers && volunteers.length > 0 && (
        <ShowVolunteers
          volunteers={volunteers}
          handleRemove={handleRemove}
          removeLoading={removeLoading}
          setVolunteers={setVolunteers}
          handleMarkLeft={handleMarkLeft}
        />
      )}
      {!loading && !error && volunteers.length === 0 && (
        <h3 className="text-xl font-bold text-center">{`No ${reqStatus} Volunteers Found`}</h3>
      )}
      {error && <ServerError error={error} />}
      {!loading && volunteers && volunteers.length > 0 && (
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

export default VolunteerDashboard;
