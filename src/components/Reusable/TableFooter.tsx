"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface TableFooterProps {
  title: string;
  length: number;
  currentPage: number;
  setRowsPerPage: (num: number) => void;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
}

const TableFooter = ({
  title,
  length,
  currentPage,
  setRowsPerPage,
  setCurrentPage,
  rowsPerPage,
}: TableFooterProps) => {
  const rowsPerPageOptions = [2, 10, 20, 40, 60];
  const totalPages = Math.ceil(length / rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 text-gray-600 bg-gray-50 border-t rounded-b-md">
      <span>
        মোট {title} <strong>{length}</strong> টি
      </span>

      <div className="flex items-center space-x-3">
        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <MdKeyboardArrowLeft size={22} />
          </button>

          <span className="border px-4 pt-1 pb-0.5 rounded bg-gray-100 border-gray-200 text-gray-700 font-medium">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <MdKeyboardArrowRight size={22} />
          </button>
        </div>

        {/* Rows per page dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
              {rowsPerPage} {title} / পেজ <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {rowsPerPageOptions.map((num) => (
              <DropdownMenuItem
                key={num}
                onClick={() => {
                  setRowsPerPage(num);
                  setCurrentPage(1);
                }}
                className="cursor-pointer"
              >
                {num} {title} / পেজ
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TableFooter;
