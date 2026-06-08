'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function buildPageUrl(
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams>,
  page: number,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page === 1) {
    params.delete('page');
  } else {
    params.set('page', String(page));
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // Build page range: show at most 5 page buttons
  const delta = 2;
  const rangeStart = Math.max(1, currentPage - delta);
  const rangeEnd = Math.min(totalPages, currentPage + delta);
  const pages: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildPageUrl(pathname, searchParams, currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white text-sm font-medium hover:border-mosque hover:text-mosque transition-all"
          aria-label="Previous page"
        >
          <span className="material-icons text-base">chevron_left</span>
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed select-none">
          <span className="material-icons text-base">chevron_left</span>
          Prev
        </span>
      )}

      {/* First page + ellipsis */}
      {rangeStart > 1 && (
        <>
          <Link
            href={buildPageUrl(pathname, searchParams, 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white text-sm hover:border-mosque hover:text-mosque transition-all"
          >
            1
          </Link>
          {rangeStart > 2 && (
            <span className="w-9 h-9 flex items-center justify-center text-nordic-muted text-sm">
              …
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildPageUrl(pathname, searchParams, p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            p === currentPage
              ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10'
              : 'bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque'
          }`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}

      {/* Last page + ellipsis */}
      {rangeEnd < totalPages && (
        <>
          {rangeEnd < totalPages - 1 && (
            <span className="w-9 h-9 flex items-center justify-center text-nordic-muted text-sm">
              …
            </span>
          )}
          <Link
            href={buildPageUrl(pathname, searchParams, totalPages)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white text-sm hover:border-mosque hover:text-mosque transition-all"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildPageUrl(pathname, searchParams, currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white text-sm font-medium hover:border-mosque hover:text-mosque transition-all"
          aria-label="Next page"
        >
          Next
          <span className="material-icons text-base">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed select-none">
          Next
          <span className="material-icons text-base">chevron_right</span>
        </span>
      )}
    </nav>
  );
}
