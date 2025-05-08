import AddEvent from "@/components/Admin/AddEvent";
import ShowEvents from "@/components/Admin/ShowEvents";
import Pagination from "@/components/Pagination";
import ServerError from "@/components/ServerError";
import SkeletonEvent from "@/components/Skeletons/SkeletonEvent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { Megaphone, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
function CampaignDashboard() {
  // /api/events
  const [events, setEvents] = useState<any>([]);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadCampaigns = async () => {
      if (!token) return;

      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .get("/api/events", {
          params: {
            page: currentPage,
            limit: 10,
          },
        })
        .then((res) => {
          setEvents(res.data.data);
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
    loadCampaigns();
  }, [currentPage]);

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
      .delete(`/api/events/${id}`)
      .then((res) => {
        const updatedDonors = events.filter((event: any) => event._id !== id);
        setEvents(updatedDonors);
        toast({
          variant: "default",
          title: `✅ ${res.data.message || "Successfully Removed Event"}`,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: `❌ ${err.response.data.message || "Failed to Remove Event"}`,
        });
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-full overflow-hidden py-8 md:py-4 px-3">
      {/* <AnimatedListDemo /> */}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-x-2">
          <Megaphone /> Event Dashboard
        </h3>
        <Button
          className="bg-primary rounded-full flex items-center gap-x-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus />
          Add Campaign
        </Button>
      </div>
      <AddEvent open={isOpen} setOpen={setIsOpen} setEvents={setEvents} />
      {loading && <SkeletonEvent />}
      {!loading && events && events.length > 0 && (
        <ShowEvents
          handleRemove={handleRemove}
          events={events}
          removeLoading={removeLoading}
          setEvents={setEvents}
        />
      )}
      {!loading && !error && events.length === 0 && (
        <h3 className="text-xl font-bold text-center">No Donors Found</h3>
      )}
      {error && <ServerError error={error} />}
      {!loading && events && events.length > 0 && (
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

export default CampaignDashboard;
