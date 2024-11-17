import React, { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const PageInitiation = ({ handlePreviousNext, nextFlag }) => {
  const [page, setPage] = useState(1);
  return (
    <div className="-z-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 sm:items-center justify-between">
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <div
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              onClick={() => {
                if (page > 1) {
                  setPage((page) => page - 1);
                  handlePreviousNext(page - 1);
                }
              }}
            >
              <GrFormPrevious />
            </div>
            <div
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </div>
            <div
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              onClick={() => {
                if (nextFlag) {
                  setPage((page) => page + 1);
                  handlePreviousNext(page + 1);
                }
              }}
            >
              <MdNavigateNext />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PageInitiation;
