import React from 'react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Pagination({
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
}: PaginationProps) {

  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageDots = () => {
    const dots = [];
    const maxVisibleDots = 5;
    let startDot = Math.max(0, Math.min(currentPage - Math.floor(maxVisibleDots / 2), totalPages - maxVisibleDots));
    let endDot = Math.min(startDot + maxVisibleDots, totalPages);

    for (let i = startDot; i < endDot; i++) {
      const isActive = i === currentPage;
      dots.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 flex items-center justify-center size-3 rounded-full focus:outline-none ${isActive
              ? 'bg-green-500'
              : 'bg-gray-200 hover:bg-gray-300'
            }`}
          aria-label={`Page ${i + 1}`}
          aria-current={isActive ? 'page' : undefined}
        />
      );
    }

    return dots;
  };

  return (
    <div className="pagination flex justify-center items-center space-x-2">
          <button
        onClick={() => handlePageChange(0)}
        disabled={currentPage === 0}
        className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none disabled:opacity-50"
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none disabled:opacity-50"
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      {renderPageDots()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none disabled:opacity-50"
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none disabled:opacity-50"
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;