import { useNavigate, useParams } from "react-router-dom";
import Refugee from "../assets/refugeeimage.jpg";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import {
  Calendar,
  HandCoins,
  IndianRupee,
  MessageCircleHeart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import FeedbackSkele from "@/components/Skeletons/FeedbackSkele";
import FeedbackCarousel from "@/components/FeedbackCarousel";
function CampaignDetails() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      axiosInstance
        .get(`/api/events/find/${id}`)
        .then((res) => {
          setEvent(res.data.data);
        })
        .catch((err) => {
          setError(err.message.toString());
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchEvent();
  }, [id]);
  const handleDonation = () => {
    if (!event) {
      navigate(`/campaigns/`);
      toast({
        variant: "destructive",
        title: "Event not found",
      });
      return;
    }
    if (!user) {
      toast({
        variant: "destructive",
        title: "Must be logged in to donate",
      });
      navigate("/auth/login");
      return;
    }
    navigate(`/payments/${event._id}`);
  };
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="w-full h-[320px] max-md:h-auto overflow-hidden relative flex gap-x-40 items-center max-md:flex-col">
        {!event?.coverPhotoHighQuality && (
          <Avatar className="h-24 w-24">
            <AvatarFallback>Cover</AvatarFallback>
          </Avatar>
        )}
        <img
          src={event?.coverPhotoHighQuality}
          alt=""
          className="object-cover w-[300px] mt-5 ml-2 h-[300px] max-[500px]:w-[230px] max-[500px]:h-[230px] rounded-full"
        />
        <h3 className="text-3xl font-bold comfortaa-apply mt-20">
          {event?.Event_name || "Event Name"}
        </h3>
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [7, 1],
            [1, 7],
            [8, 2],
            [4, 6],
            [12, 4],
            [12, 0],
            [14, 3],
            [16, 5],
            [1, 2],
            [1, 0],
            [5, 7],
            [7, 9],
            [9, 7],
            [19, 2],
            [25, 4],
            [30, 1],
          ]}
          className={cn(
            "top-[0%] max-md:top-[15%] left-0 h-[250px] -skew-y-6 w-full dark:opacity-40 opacity-60 z-50"
          )}
        />
      </div>
      <div className="max-w-2xl mx-auto my-5 p-2 flex flex-col gap-y-3">
        <h3 className="text-xl font-bold flex items-center gap-x-2">
          <Calendar />
          <span>{event?.Event_date.split("T")[0] || "Event Date"}</span>
        </h3>

        <div className="w-full flex items-center gap-x-2 max-[425px]:flex-col gap-y-2">
          <Progress
            value={(event?.Current_fund / event?.Target_fund) * 100}
            className="w-full border border-secondary-foreground h-5 "
          />
          <div className="w-1/3 max-[425px]:w-full flex items-center gap-x-2">
            <IndianRupee size={17} />
            {event?.Current_fund === 0 && <span className="text-xl font-medium">{event?.Current_fund}</span>}
            <NumberTicker
              value={event?.Current_fund || 0.0}
              className="whitespace-pre-wrap text-xl font-medium tracking-tighter"
            />
            {"/"}
            <IndianRupee size={17} />
            <NumberTicker
              value={event?.Target_fund || 0}
              className="whitespace-pre-wrap text-xl font-medium tracking-tighter"
            />
          </div>
        </div>
        <p className="text-base">{event?.description || "Event Description"}</p>
        <Button
          className="flex items-center gap-x-3 text-xl mt-5"
          onClick={handleDonation}
        >
          <HandCoins style={{ height: "20px", width: "20px" }} />
          Donate Now
        </Button>
      </div>
      <Separator />
      <div className="w-full my-3">
        <h3 className="text-2xl font-bold flex items-center gap-x-2">
          <MessageCircleHeart />
          Feedbacks Of Active Donors
        </h3>
          {id &&<FeedbackCarousel eventId={id}/>}
      </div>
    </div>
  );
}

export default CampaignDetails;
