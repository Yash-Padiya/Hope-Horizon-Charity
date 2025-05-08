import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";

function EventMarqueeCard(event: any) {
  const navigate = useNavigate();
  const [pollValue, setPollValue] = useState<number>(0);
  useEffect(() => {
    if (!event) return;
    console.log("in use fff");
    setPollValue(
      Number(((event?.event?.Current_fund / event?.event?.Target_fund) * 100).toFixed(2))
    );
  }, []);

  return (
    <div
      className={cn(
        "relative h-full flex flex-col gap-y-2 items-center w-64 cursor-pointer overflow-hidden rounded-xl border p-4 shadow-sm",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
      onClick={() => navigate(`/campaigns`)}
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarImage
            src={event.event.coverPhotoLowQuality || ""}
            alt="avatar"
          />
          <AvatarFallback>
            {event.event?.Event_name?.substring(0, 2).toUpperCase() ||
              event.Event_name}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3>{event.event.Event_name || event.Event_name}</h3>
          <p className="text-xs font-medium dark:text-white/40">
            {event?.event?.description?.substring(0, 50) ||
              event.Event_description}
            ...
          </p>
        </div>
      </div>
      <blockquote className="text-sm text-center">
        {event.event.Event_date.split("T")[0] || event.Event_date}
      </blockquote>
      <Progress value={pollValue} className="w-1/2" />₹{event.event.Current_fund || event.Current_fund}/
      {event.event.Target_fund || event.Target_fund}
      <Button className="text-sm p-2" variant="outline">
        Donate Now
      </Button>
    </div>
  );
}

export default EventMarqueeCard;
