import { Skeleton } from "../ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="my-5 h-screen max-w-7xl overflow-hidden mx-auto">
      <h4 className="text-2xl font-semibold comfortaa-apply my-3 px-3">
        Profile
      </h4>

      <div className="flex flex-col gap-y-5">
        <div className="relative">
          <Skeleton className="absolute top-2 left-1 h-5 w-5 bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
          {/* Icon Skeleton */}
          <Skeleton className="h-10 w-full rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Input Skeleton */}
        </div>

        <div className="relative">
          <Skeleton className="absolute top-2 left-1 h-5 w-5 bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
          {/* Icon Skeleton */}
          <Skeleton className="h-10 w-full rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Input Skeleton */}
        </div>

        <div className="relative">
          <Skeleton className="absolute top-2 left-1 h-5 w-5 bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
          {/* Icon Skeleton */}
          <Skeleton className="h-24 w-full rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Textarea Skeleton */}
        </div>

        <div className="relative">
          <Skeleton className="absolute top-2 left-1 h-5 w-5 bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
          {/* Icon Skeleton */}
          <Skeleton className="h-10 w-full rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Input Skeleton */}
        </div>

        <div className="relative">
          <Skeleton className="absolute top-2 left-1 h-5 w-5 bg-[#742bf35f] dark:bg-[#742bf32f]" />{" "}
          {/* Icon Skeleton */}
          <Skeleton className="h-10 w-full rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Input Skeleton */}
        </div>

        <div className=" flex max-md:flex-col gap-x-4 gap-y-3">
          <Skeleton className="w-full h-10 rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Button Skeleton */}
          <Skeleton className="w-full h-10 rounded-md bg-[#742bf369] dark:bg-[#742bf334]" />{" "}
          {/* Button Skeleton */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
