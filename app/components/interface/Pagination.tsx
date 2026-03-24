type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
};

export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  disabled,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1 || disabled}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        前のページ
      </button>

      <span>
        {currentPage}/{totalPages}ページ
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages || disabled}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        次のページ
      </button>
    </div>
  );
}