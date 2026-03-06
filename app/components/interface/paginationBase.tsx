type PaginationUIProps = {
  currentPage: number;
  totalPages: number;
  previousAction?: () => void;
  nextAction?: () => void;
  previousHref?: string;
  nextHref?: string;
};

export function PaginationUI({
  currentPage,
  totalPages,
  previousAction,
  nextAction,
  previousHref,
  nextHref,
}: PaginationUIProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      {previousHref ? (
        <a href={previousHref} className="px-3 py-1 border rounded">
          Previous
        </a>
      ) : previousAction ? (
        <button onClick={previousAction} className="px-3 py-1 border rounded">
          Previous
        </button>
      ) : (
        <span className="px-3 py-1 border rounded opacity-50">Previous</span>
      )}

      <span>
        Page {currentPage} of {totalPages}
      </span>

      {nextHref ? (
        <a href={nextHref} className="px-3 py-1 border rounded">
          Next
        </a>
      ) : nextAction ? (
        <button onClick={nextAction} className="px-3 py-1 border rounded">
          Next
        </button>
      ) : (
        <span className="px-3 py-1 border rounded opacity-50">Next</span>
      )}
    </div>
  );
}