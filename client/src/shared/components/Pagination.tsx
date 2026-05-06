import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: IPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-400 disabled:hover:border-stone-200 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-stone-400 font-bold text-xs select-none">
              •••
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isCurrent
                ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary'
                : 'border border-stone-200 text-stone-600 hover:text-primary hover:bg-primary/5 hover:border-primary/20'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-400 disabled:hover:border-stone-200 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
