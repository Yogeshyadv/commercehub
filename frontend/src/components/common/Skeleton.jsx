// Base shimmer skeleton block
export function Skeleton({ className = '', style }) {
  return (
    <div
      className={`skeleton rounded-lg ${className} bg-gray-200 dark:bg-white/10`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Row of 4 KPI stat cards (Dashboard)
export function SkeletonStatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#0d0d0d] rounded-2xl p-5 space-y-3 border border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-start justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

// Generic content card skeleton
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl p-5 space-y-3 border border-gray-100 dark:border-white/[0.07]">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: `${90 - i * 10}%` }} />
      ))}
    </div>
  );
}

// Single table row skeleton
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: i === 0 ? '60%' : i === cols - 1 ? '40%' : '70%' }} />
        </td>
      ))}
    </tr>
  );
}

// Full table skeleton (header + N rows)
export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.07]">
      {/* header bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.07]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: `${60 + (i % 3) * 20}px` }} />
        ))}
      </div>
      <table className="w-full bg-white dark:bg-[#0d0d0d]">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Page header (title + subtitle + action button)
export function SkeletonPageHeader() {
  return (
    <div className="flex items-center justify-between py-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  );
}
