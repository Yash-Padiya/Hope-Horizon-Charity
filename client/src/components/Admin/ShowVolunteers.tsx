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
import { Check, Loader2, PenBoxIcon, Trash2 } from "lucide-react";
import UpdateVolunteer from "./UpdateVolunteer";
type ShowDataProps = {
  handleRemove: (id: string) => void;
  handleMarkLeft: (id: string) => void;
  volunteers: any[];
  removeLoading: boolean;
  setVolunteers: React.Dispatch<React.SetStateAction<any[]>>;
};
function ShowVolunteers({
  handleRemove,
  volunteers,
  removeLoading,
  setVolunteers,
  handleMarkLeft,
}: ShowDataProps) {
  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [isOpenUpdate, setOpenUpdate] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleConfirmDelete = () => {
    handleRemove(id);
    setOpen(false);
  };
  return (
    <div className="overflow-hidden my-3 w-full">
      <Table>
        <TableCaption>Volunteers of Hope Horizon Charity.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile No.</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Aadhar No</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((volunteer, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-[150px]">
                {volunteer.name}
              </TableCell>
              <TableCell>{volunteer.email}</TableCell>
              <TableCell>{volunteer.mobile_no}</TableCell>
              <TableCell className="w-[300px]">{volunteer.address}</TableCell>
              <TableCell>{volunteer.aadhar_no}</TableCell>
              <TableCell className="flex flex-col float-end gap-y-2 max-w-fit ">
                <div className="flex gap-x-2 items-center">
                  {!volunteer.leaveDate && (
                    <Button
                      variant="outline"
                      className="flex gap-x-2 items-center"
                      onClick={() => {
                        setOpenUpdate(true);
                        setId(volunteer._id);
                      }}
                    >
                      <PenBoxIcon /> Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="flex gap-x-2 items-center"
                    onClick={() => {
                      setOpen(true);
                      setId(volunteer._id);
                    }}
                  >
                    <Trash2 /> Remove
                  </Button>
                </div>
                {!volunteer.leaveDate &&
                  (isLoading ? (
                    <Button
                      variant="outline"
                      className="flex gap-x-2 items-center text-primary"
                      disabled
                    >
                      <Loader2 className="animate-spin" /> Marking as left
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex gap-x-2 items-center"
                      onClick={() => {
                        setId(volunteer._id);
                        handleMarkLeft(id);
                      }}
                    >
                      <Check /> Mark as left
                    </Button>
                  ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isOpenUpdate && (
        <UpdateVolunteer
          open={isOpenUpdate}
          setOpen={setOpenUpdate}
          setVolunteers={setVolunteers}
          id={id}
        />
      )}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete volunteer?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete
              volunteer account and remove volunteer data from our servers.
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

export default ShowVolunteers;
