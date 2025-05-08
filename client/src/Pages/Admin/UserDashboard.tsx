import AddUser from "@/components/Admin/AddUser";
import ShowUsers from "@/components/Admin/ShowUsers";
import Pagination from "@/components/Pagination";
import ServerError from "@/components/ServerError";
import SkeletonTable from "@/components/Skeletons/SkeletonTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { axiosInstance, setAuthToken } from "@/utils/axiosInstance";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function UserDashboard() {
  const [donors, setDonors] = useState<any>([]);
  const {toast} = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadDonors = async () => {
      if (!token) return;

      setLoading(true);
      setAuthToken(token);
      axiosInstance
        .get("/api/auth/donors", {
          params: {
            page: currentPage,
            limit: 10,
          },
        })
        .then((res) => {
          setDonors(res.data.data);
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
    loadDonors();
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
      .delete(`/api/auth/remove-user/${id}`)
      .then((res) => {
        const updatedDonors = donors.filter((donor: any) => donor._id !== id);
        setDonors(updatedDonors);
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
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-full overflow-hidden py-8 md:py-4 px-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-x-2">
          <Users /> Donors Dashboard
        </h3>
        <Button
          className="bg-primary rounded-full flex items-center gap-x-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus />
          Add Donor
        </Button>
      </div>
      <AddUser open={isOpen} setOpen={setIsOpen} setDonors={setDonors} />
      {loading && <SkeletonTable />}
      {!loading && donors && donors.length > 0 && (
        <ShowUsers
          handleRemove={handleRemove}
          donors={donors}
          removeLoading={removeLoading}
        />
      )}
      {!loading && !error && donors.length === 0 && (
        <h3 className="text-xl font-bold text-center">No Donors Found</h3>
      )}
      {error && <ServerError error={error} />}
      {!loading && donors && donors.length > 0 && (
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

export default UserDashboard;
