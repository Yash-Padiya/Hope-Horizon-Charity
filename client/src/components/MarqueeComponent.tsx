import { axiosInstance } from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { Marquee } from "./magicui/marquee";
import EventCardSkeleton from "./Skeletons/EventCardSkeleton";
import EventMarqueeCard from "./EventMarqueeCard";

function MarqueeComponent() {
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const demoEvents = [
    {
      _id: "1",
      Event_name: "Animal Welfare",
      Event_description: "Support animals in need and raise awareness",
      Target_fund: 10000,
      Current_fund: 1000,
      Event_image: "https://via.placeholder.com/150",
      Event_date: "2025-02-23T00:00:00.000Z",
    },
    {
      _id: "2",
      Event_name: "Support Victims of Natural Disasters",
      Event_description: "Donate to help victims of natural disasters.",
      Target_fund: 13000,
      Current_fund: 5000,
      Event_image: "https://via.placeholder.com/150",
      Event_date: "2025-02-25T00:00:00.000Z",
    },
    {
      _id: "3",
      Event_name: "Help Children in Need",
      Event_description:
        "Donate to help children in need. Help them to buy basic necessities.",
      Target_fund: 7000,
      Current_fund: 3000,
      Event_image: "https://via.placeholder.com/150",
      Event_date: "2025-02-25T00:00:00.000Z",
    },
  ];
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      axiosInstance
        .get("/api/events", {
          params: {
            page: 1,
            limit: 3,
          },
        })
        .then((res) => {
          setEvents(res.data.data);
        })
        .catch((err) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchEvents();
  }, []);
  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden my-2">
      <h3 className="text-2xl font-bold my-3 comfortaa-apply z-10 px-3 text-center">
        Help Us To
        <span className="text-primary"> Implement</span> These Projects
      </h3>
      {events && events.length > 0 && (
        <>
          <Marquee pauseOnHover className="[--duration:20s]">
            {events.map((event: any, index: number) => (
              <EventMarqueeCard key={index} event={event} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        </>
      )}
      {loading && (
        <div className="flex gap-x-2 items-center my-3 w-full px-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
        </div>
      )}
      {error && demoEvents.length > 0 && (
        <>
          <Marquee pauseOnHover className="[--duration:20s]">
            {demoEvents.map((event: any) => (
              <EventMarqueeCard key={event._id} event={event} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        </>
      )}
    </div>
  );
}

export default MarqueeComponent;
