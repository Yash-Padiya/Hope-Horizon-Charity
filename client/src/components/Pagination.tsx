import React from "react";
import { Button } from "./ui/button";

type PaginationProps = {
  currentPage: number; // The current page number
  totalPages: number; // The total number of pages
  onPrev: () => void; // Function to handle previous page action
  onNext: () => void; // Function to handle next page action
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-end w-full space-x-4 mt-5">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentPage === 1}
        className="disabled:cursor-not-allowed "
      >
        Prev
      </Button>

      {/* Current Page Label */}
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages }
      </span>

      {/* Next Button */}
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
