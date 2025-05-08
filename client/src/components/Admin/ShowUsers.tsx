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
type ShowDataProps = {
  handleRemove: (id: string) => void;
  donors: any[];
  removeLoading: boolean;
};
function ShowUsers({ handleRemove, donors, removeLoading }: ShowDataProps) {
  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const handleConfirmDelete = () => {
      handleRemove(id);
      setOpen(false);
  };
  return (
    <div className="overflow-hidden my-3 w-full">
      <Table>
        <TableCaption>Donors of Hope Horizon Charity.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile No.</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Aadhar No</TableHead>
            <TableHead>PAN No</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{donor.username}</TableCell>
              <TableCell>{donor.email}</TableCell>
              <TableCell>{donor.mobile_no}</TableCell>
              <TableCell>{donor.address}</TableCell>
              <TableCell>{donor.aadhar_no}</TableCell>
              <TableCell>{donor.pan_no}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOpen(true);
                    setId(donor._id);
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete donor?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete donor
              account and remove donor data from our servers.
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

export default ShowUsers;
