import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
// Make sure to import the Skeleton component

const EventCardSkeleton = ({ className }: { className?: string | undefined }) => {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        className,
      )}
    >
      <div className="flex flex-row items-center gap-2 w-[300px]">
        <Skeleton className="h-10 w-10 rounded-full bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
        {/* Avatar Skeleton */}
        <div className="flex flex-col">
          <Skeleton className="h-5 w-3/4 bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Event Name Skeleton */}
          <Skeleton className="h-4 w-1/2 bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Description Skeleton */}
        </div>
      </div>
      <Skeleton className="mt-2 h-4 w-1/2 bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
      {/* Event Date Skeleton */}
    </div>
  );
};

export default EventCardSkeleton;
