import { Skeleton } from "../ui/skeleton";

function CampaignDetailSkele() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="w-full h-[320px] overflow-hidden relative flex gap-x-40 items-center">
        <Skeleton className="w-[300px] h-[300px] rounded-full bg-[#742bf35f] dark:bg-[#742bf32f]" />
        <Skeleton className="w-[200px] h-[30px] bg-[#742bf35f] dark:bg-[#742bf32f] mt-20" />
      </div>
      <div className="max-w-2xl mx-auto my-5 p-2 flex flex-col gap-y-3">
        <Skeleton className="w-full h-[30px] bg-[#742bf35f] dark:bg-[#742bf32f]" />
        <Skeleton className="w-full h-[5px] bg-[#742bf35f] dark:bg-[#742bf32f]" />
        <Skeleton className="w-full h-[20px] bg-[#742bf35f] dark:bg-[#742bf32f]" />
        <Skeleton className="w-[200px] h-[40px] bg-[#742bf35f] dark:bg-[#742bf32f] mt-5" />
        <Skeleton className="w-full h-[20px] bg-[#742bf35f] dark:bg-[#742bf32f] mt-5" />
      </div>
      <div className="w-full my-3">
        <Skeleton className="w-[200px] h-[30px] bg-[#742bf35f] dark:bg-[#742bf32f]" />
      </div>
    </div>
  );
}

export default CampaignDetailSkele;
