import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { clsx } from 'clsx';

export default function Pagination({ page, totalPages, onPageChange, total, limit }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start + 1 < 5) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-500 dark:text-[#6868a0]">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{from}</span> to{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{to}</span> of{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-xl border border-gray-200 dark:border-white/[0.1]
            text-gray-500 dark:text-[#7070a0]
            hover:bg-gray-100 dark:hover:bg-white/[0.07]
            hover:text-gray-800 dark:hover:text-white
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all',
              p === page
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.3)]'
                : 'text-gray-600 dark:text-[#8888a8] hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-xl border border-gray-200 dark:border-white/[0.1]
            text-gray-500 dark:text-[#7070a0]
            hover:bg-gray-100 dark:hover:bg-white/[0.07]
            hover:text-gray-800 dark:hover:text-white
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}