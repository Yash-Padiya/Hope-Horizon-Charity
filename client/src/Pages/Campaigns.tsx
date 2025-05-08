import CampaginCard from "@/components/CampaginCard";
import Pagination from "@/components/Pagination";
import ServerError from "@/components/ServerError";
import EventCardSkeleton from "@/components/Skeletons/EventCardSkeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import { axiosInstance } from "@/utils/axiosInstance";
import { ListFilter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Campaigns() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [filter, setFilter] = useState("All");

  const [events, setEvents] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
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
          setError(err.message.toString());
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadEvents();
  }, [currentPage]);
  useEffect(() => {
    if (!events) return;
    let filtered = events;
    if (filter === "All") {
      setFilteredEvents(events);
    }
    if (filter === "closeToTarget") {
      filtered = filtered.filter(
        (event: any) =>
          Number(
            ((event?.Current_fund / event?.Target_fund) * 100).toFixed(2)
          ) >= 50
      );

      setFilteredEvents(filtered);
    }
  }, [filter, events]);
  const handleDonate = (id: string) => {
    navigate(`/campaigns/${id}`);
  };
  const onPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const onNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    if (value.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event: any) =>
        event.Event_name.toLowerCase().includes(value)
      );
      setFilteredEvents(filtered);
    }
  };
  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center p-4">
      <div className="flex flex-col w-full gap-y-2">
        <div className="relative w-full flex items-center justify-between gap-x-2">
          <Search className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for Campaign Name"
            className="rounded-full pl-10 py-2 text-muted-foreground font-semibold confortaa-apply border border-primary/50 focus:border-0"
            onChange={handleSearch}
          />
          <div className="w-1/4 overflow-hidden">
            <Select onValueChange={(value) => setFilter(value)} value={filter}>
              <SelectTrigger>
                <SelectValue placeholder={<ListFilter />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" defaultChecked={true}>
                  All Campaigns
                </SelectItem>
                <SelectItem value="closeToTarget">Close to Target</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full my-5">
          {/* flex flex-wrap items-center gap-y-3 gap-x-5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents &&
              !loading &&
              filteredEvents.map((event: any) => (
                <CampaginCard
                  key={event._id}
                  event={event}
                  handleDonate={handleDonate}
                />
              ))}
          </div>
        </div>
        {loading && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden ">
            {(Array(6).fill(0) as any).map((_: any, index: number) => (
              <EventCardSkeleton key={index} className="w-full h-[200px]" />
            ))}
          </div>
        )}
        {error && <ServerError error={error} />}
        {filteredEvents.length === 0 && !loading && !error && (
          <p className="text-center text-2xl font-semibold">
            Currently there are no campaigns{" "}
            {filter === "closeToTarget" ? "close to target" : ""}.
          </p>
        )}
        {events.length === 0 && !loading && !error && (
          <p className="text-center text-2xl font-semibold">
            Currently there are no campaigns
          </p>
        )}
        {events && events.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={onPrev}
            onNext={onNext}
          />
        )}
      </div>
    </div>
  );
}

export default Campaigns;
