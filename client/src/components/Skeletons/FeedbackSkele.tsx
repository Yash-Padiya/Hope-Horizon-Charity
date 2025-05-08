import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function FeedbackSkele() {
  return (
    <div className="flex items-center justify-evenly my-10 gap-x-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card className="p-4 w-1/3" key={index}>
          <CardContent>
            <Skeleton className="h-6 w-1/2 mb-2 bg-[#742bf35f] dark:bg-[#742bf32f]" />
            <Skeleton className="h-4 w-3/4 mb-2 bg-[#742bf35f] dark:bg-[#742bf32f]" />
            <Skeleton className="h-4 w-1/4 bg-[#742bf35f] dark:bg-[#742bf32f]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default FeedbackSkele;
