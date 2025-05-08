import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

function CampaginCard({
  event,
  handleDonate,
}: {
  event: any;
  handleDonate: (id: string) => void;
}) {
  const [pollValue, setPollValue] = useState<number>(0);
  useEffect(() => {
    if (!event) return
    console.log("in use fff");
    setPollValue(Number(((event?.Current_fund/ event?.Target_fund)*100).toFixed(2)))
  }, []);
  return (
    <div
      className={cn(
        "relative h-full flex flex-col gap-y-2 items-center w-full  overflow-hidden rounded-xl border p-4 shadow-md",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] ",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] "
      )}
    >
      <div className="flex items-center gap-5 w-full">
        <Avatar className="h-24 w-24 rounded-sm">
          <AvatarImage src={event?.coverPhotoLowQuality} alt="avatar" />
          <AvatarFallback className="rounded-sm">
            {event?.Event_name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <h3>{event?.Event_name}</h3>
          <p className="text-xs font-medium dark:text-white/40">
            {event?.description?.substring(0, 50)}...
          </p>
        </div>
      </div>
      <h4 className="text-sm flex items-center gap-x-2">
        <Calendar size={16} /> {event.Event_date.split("T")[0]}
      </h4>
      <div className="w-full flex items-center gap-x-2">
      
        <Progress
          value={pollValue}
          className="w-full border border-secondary-foreground"
        />
        
        <span className="text-sm w-1/3">₹{event?.Current_fund}/₹{event?.Target_fund}</span>
      </div>
      <Button
        variant="outline"
        className="border-primary dark:border-0 active:bg-primary/70"
        onClick={() => handleDonate(event._id)}
      >
        Donate Now
      </Button>
    </div>
  );
}

export default CampaginCard;
