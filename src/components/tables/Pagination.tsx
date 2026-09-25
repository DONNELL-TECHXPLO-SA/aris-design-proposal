type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(currentPage - 1, 1),
  );

  return (
    <div className="flex items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="me-[10px] flex h-[44px] items-center justify-center rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover disabled:opacity-50"
      >
        Previous
      </button>
      <div className="flex items-center gap-[6px] text-fx-17 text-secondary">
        {currentPage > 3 && <span className="px-2">...</span>}
        {pagesAroundCurrent.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`tabular-numbers flex size-[44px] items-center justify-center rounded-full text-fx-17 ${
              currentPage === page ? "bg-dark text-on-dark" : "text-secondary hover:text-ink"
            }`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 2 && <span className="px-2">...</span>}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ms-[10px] flex h-[44px] items-center justify-center rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
