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
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <HiChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers().map((p) => (
          <button key={p} onClick={() => onPageChange(p)}
            className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              p === page ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            )}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <HiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}