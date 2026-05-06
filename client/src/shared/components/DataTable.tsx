import React from 'react';
import Pagination from './Pagination';

export interface IColumn<T> {
  header: React.ReactNode;
  accessor?: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface IDataTableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export default function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  pagination,
}: IDataTableProps<T>) {
  return (
    <div className="space-y-6">
      <div className="w-full overflow-x-auto rounded-[2.5rem] border border-stone-200/50 bg-white/30 backdrop-blur-xl shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-200/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`py-5 px-8 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-200/50 select-none ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`loader-${rowIndex}`} className="border-b border-stone-100 last:border-0">
                  {columns.map((_, colIndex) => (
                    <td key={`loader-td-${colIndex}`} className="py-6 px-8">
                      <div className="h-4 bg-stone-200/60 rounded-lg animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <div className="space-y-2">
                    <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-[10px]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-stone-50/20 border-b border-stone-100 last:border-0 transition-colors group"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-5 px-8 font-semibold text-stone-600 text-sm leading-relaxed ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row, rowIndex)
                        : column.accessor
                        ? (row[column.accessor as keyof T] as unknown as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && data.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
