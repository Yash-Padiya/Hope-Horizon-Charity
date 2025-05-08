import { Skeleton } from "@/components/ui/skeleton";

const DonationHistorySkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-4 p-4">
        {/* Table Header Skeletons */}
        {["Transaction ID", "Event Name", "Amount", "Status", "Receipt"].map(
          (item, index) => (
            <Skeleton
              key={index}
              className="h-6 w-full bg-[#742bf35f] dark:bg-[#742bf32f]"
            />
          )
        )}
      </div>

      {/* Table Rows Skeletons (Assuming 5 rows) */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 p-4">
          <Skeleton className="h-6 w-full bg-[#742bf35f] dark:bg-[#742bf32f]" />
          <Skeleton className="h-6 w-full bg-[#742bf35f] dark:bg-[#742bf32f]" />
          <Skeleton className="h-6 w-full bg-[#742bf35f] dark:bg-[#742bf32f]" />
          <Skeleton className="h-6 w-full bg-[#742bf35f] dark:bg-[#742bf32f]" />
          <Skeleton className="h-6 w-20 rounded-md bg-[#742bf35f] dark:bg-[#742bf32f]" />
        </div>
      ))}
    </div>
  );
};

export default DonationHistorySkeleton;
