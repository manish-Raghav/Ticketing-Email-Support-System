
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    siblingCount = 1,
}) => {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - siblingCount);
        const endPage = Math.min(
            totalPages,
            currentPage + siblingCount
        );

        if (startPage > 1) {
            pages.push(1);

            if (startPage > 2) {
                pages.push("...");
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        onPageChange?.(page);
    };

    return (
        <div className="flex flex-col items-center justify-between gap-4
    border-t border-gray-200 pt-4 sm:flex-row">

            <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                    {startItem}-{endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                    {totalItems}
                </span>{" "}
                results
            </p>

            <div className="flex items-center gap-1">

                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 p-2
          text-gray-600 hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-gray-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`
                min-w-9 rounded-lg px-3 py-2 text-sm font-medium
                transition
                ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
              `}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-300 p-2
          text-gray-600 hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>

            </div>
        </div>
    );
};

export default Pagination;
