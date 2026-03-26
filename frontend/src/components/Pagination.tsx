interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void; }
export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-4">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
      <span className="px-3 py-1">{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  );
}
