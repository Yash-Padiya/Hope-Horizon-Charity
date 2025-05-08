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
  handleUpdate: (id: string, updateTo: string) => void;
  supportReqs: any[];
  removeLoading: boolean;
};
function ShowSupport({
  handleUpdate,
  supportReqs,
  removeLoading,
}: ShowDataProps) {
  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [updateTo, setUpdateTo] = useState<string>("");
  const handleConfirmUpdate = async () => {
    await handleUpdate(id, updateTo);
    setOpen(false);
  };
  return (
    <div className="overflow-hidden my-3 w-full">
      <Table>
        <TableCaption>Support Queries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ticket ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Query </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Query Date</TableHead>
            {supportReqs[0].status === "pending" && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportReqs.map((supportReq, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm text-muted-foreground max-w-[130px] text-ellipsis overflow-hidden">
                #hhc{supportReq._id}cnt
              </TableCell>
              <TableCell>{supportReq?.user?.username|| 'N/A'}</TableCell>
              <TableCell>{supportReq?.user?.email|| 'N/A'}</TableCell>
              <TableCell>{supportReq?.query|| 'N/A'}</TableCell>
              <TableCell>{supportReq?.status|| 'N/A'}</TableCell>
              <TableCell>{supportReq?.date?.slice(0, 10)|| 'N/A'}</TableCell>
              {supportReq.status === "pending" && (
                <TableCell className="flex gap-y-2 flex-col">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-600/70"
                    onClick={() => {
                      setOpen(true);
                      setId(supportReq._id);
                      setUpdateTo("resolved");
                    }}
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="destructive"
                    className=""
                    onClick={() => {
                      setOpen(true);
                      setId(supportReq._id);
                      setUpdateTo("rejected");
                    }}
                  >
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to{" "}
              {updateTo === "resolved" ? "resolve" : "reject"} support request?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will set the status of the
              support request to{" "}
              {updateTo === "resolved" ? "resolve" : "reject"}.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant={`${updateTo === "resolved" ? "outline" : "destructive"}`}
            onClick={handleConfirmUpdate}
          >
            {removeLoading
              ? "Please wait..."
              : updateTo === "resolved"
              ? "Resolve"
              : "Reject"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShowSupport;
