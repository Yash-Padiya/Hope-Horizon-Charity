import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PenBoxIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UpdateEvent from "./UpdateEvent";
import { set } from "zod";
type ShowDataProps = {
  handleRemove: (id: string) => void;
  events: any[];
  removeLoading: boolean;
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
};
function ShowEvents({
  handleRemove,
  events,
  removeLoading,
  setEvents,
}: ShowDataProps) {
  const [isOpen, setOpen] = useState(false);
  const [isOpenUpdate, setOpenUpdate] = useState(false);
  const [id, setId] = useState<string>("");
  const handleConfirmDelete = () => {
    handleRemove(id);
    setOpen(false);
  };
  return (
    <div className="overflow-hidden my-3 w-full">
      <Table>
        <TableCaption>Active Campaigns of Hope Horizon Charity.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Cover Image</TableHead>
            <TableHead className="w-[140px]">Campaign Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Target Fund</TableHead>
            <TableHead>Fund Collected</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Avatar className="h-16 w-16 rounded-sm">
                  <AvatarImage
                    src={`${
                      event.coverPhotoLowQuality ||
                      "https://github.com/shadcn.png"
                    }`}
                  />
                  <AvatarFallback>
                    {event.Event_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{event.Event_name}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>₹ {event.Target_fund}</TableCell>
              <TableCell>₹ {event.Current_fund ?? "-"}</TableCell>
              <TableCell>{event.Event_date.split("T")[0]}</TableCell>
              <TableCell className="flex gap-y-2 flex-col px-3">
                <Button
                  variant="outline"
                  className="flex gap-x-2 items-center"
                  onClick={() => {
                    setOpenUpdate(true);
                    setId(event._id);
                  }}
                >
                  <PenBoxIcon /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOpen(true);
                    setId(event._id);
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isOpenUpdate && (
        <UpdateEvent
          open={isOpenUpdate}
          setOpen={setOpenUpdate}
          setEvents={setEvents}
          id={id}
        />
      )}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete event?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete event
              and remove event data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Button variant={"destructive"} onClick={handleConfirmDelete}>
            {removeLoading ? "Removing..." : "Remove"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShowEvents;
