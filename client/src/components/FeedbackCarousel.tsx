import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star, User } from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";
import ServerError from "./ServerError";
import Autoplay from "embla-carousel-autoplay";
import FeedbackSkele from "./Skeletons/FeedbackSkele";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const FeedbackCarousel = ({ eventId }: { eventId: string }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchFeedbacks = () => {
      setLoading(true);
      axiosInstance
        .get(`/api/feedbacks/`, {
          params: {
            eventId: eventId,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setFeedbacks(res.data.data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchFeedbacks();
  }, [eventId]);
  if (loading) {
    return <FeedbackSkele />;
  }
  if (error) {
    return <ServerError error={error} />;
  }
  if(!loading && !error && feedbacks.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">No feedbacks yet</p>
      </div>
    )
  }
  return (
    <Carousel
      className="w-full max-w-2xl mx-auto overflow-hidden"
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 3000 })]}
    >
      <CarouselContent>
        {feedbacks.map((feedback: any, index: number) => (
          <CarouselItem key={index} className="flex justify-center">
            <Card className="p-4 shadow-lg w-80">
              <CardContent>
                <div className="flex gap-x-5 items-center mb-3">
                  <Avatar>
                    <AvatarFallback className="flex items-center justify-center">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="text-lg font-semibold">Anonymous User</h4>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(feedback?.ratings)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-gray-600 italic">
                  "{feedback.description}"
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeedbackCarousel;
