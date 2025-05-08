import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SkeletonEvent() {
  return (
    <div className="overflow-hidden my-3 w-full">
      <Table>
        {/* Table Caption */}
        <TableCaption>
          <Skeleton className="h-4 w-1/3 bg-[#742bf35f] dark:bg-[#742bf32f]" />
        </TableCaption>

        {/* Table Header Skeleton */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334] " />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body Skeleton */}
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index} className="w-16 h-16">
              <TableCell>
                <Skeleton className="h-16 w-16 bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-3/4  bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-1/2  bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-1/3  bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-1/3  bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-1/3 bg-[#9a65f569] dark:bg-[#9a65f527]" />
              </TableCell>
              <TableCell className="flex flex-col gap-y-2">
                <Skeleton className="h-7 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
                <Skeleton className="h-7 w-full bg-[#742bf369] dark:bg-[#742bf334]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SkeletonEvent;
