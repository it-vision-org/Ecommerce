"use client";

import { useMemo, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DataTableColumn<T> = {
    id: string;
    header: ReactNode;
    render: (row: T, rowIndex: number) => ReactNode;
    headerClassName?: string;
    cellClassName?: string;
};

type DataTableProps<T> = {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T) => string;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: number[];
    onPageSizeChange?: (pageSize: number) => void;
    loading?: boolean;
    loadingRowCount?: number;
    emptyState?: ReactNode;
    maxBodyHeightClass?: string;
    getRowClassName?: (row: T) => string;
    tableClassName?: string;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export default function DataTable<T>({
    data,
    columns,
    rowKey,
    currentPage,
    pageSize,
    onPageChange,
    pageSizeOptions = [10, 20, 30, 50],
    onPageSizeChange,
    loading = false,
    loadingRowCount = 6,
    emptyState,
    maxBodyHeightClass = "max-h-[calc(100vh-320px)]",
    getRowClassName,
    tableClassName = "",
}: DataTableProps<T>) {
    const safePageSize = pageSize > 0 ? pageSize : 10;
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
    const page = clamp(currentPage, 1, totalPages);

    const pageStart = (page - 1) * safePageSize;
    const pageEnd = pageStart + safePageSize;

    const pageData = useMemo(
        () => data.slice(pageStart, pageEnd),
        [data, pageStart, pageEnd],
    );

    const showingFrom = totalItems === 0 ? 0 : pageStart + 1;
    const showingTo = totalItems === 0 ? 0 : Math.min(pageEnd, totalItems);

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className={"overflow-auto " + maxBodyHeightClass}>
                <table className={"min-w-full " + tableClassName}>
                    <thead className="bg-[var(--bg-muted)] sticky top-0 z-10">
                        <tr className="border-b border-[var(--border)]">
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className={
                                        "p-4 text-left text-sm font-medium text-[var(--text-secondary)] " +
                                        (column.headerClassName || "")
                                    }
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)]">
                        {loading &&
                            Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                                <tr key={"loading-row-" + rowIndex}>
                                    {columns.map((column) => (
                                        <td
                                            key={column.id}
                                            className={"p-4 align-middle " + (column.cellClassName || "")}
                                        >
                                            <div className="h-8 rounded bg-[var(--bg-muted)] animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading &&
                            pageData.map((row, index) => {
                                const absoluteRowIndex = pageStart + index;
                                const rowClassName = getRowClassName ? getRowClassName(row) : "";

                                return (
                                    <tr key={rowKey(row)} className={rowClassName}>
                                        {columns.map((column) => (
                                            <td
                                                key={column.id}
                                                className={"p-4 align-middle " + (column.cellClassName || "")}
                                            >
                                                {column.render(row, absoluteRowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {!loading && totalItems === 0 && (
                <div className="p-10 text-center">
                    {emptyState || (
                        <p className="text-sm text-[var(--text-secondary)]">No data available</p>
                    )}
                </div>
            )}

            <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--bg-card)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                    Showing {showingFrom} - {showingTo} of {totalItems}
                </p>

                <div className="flex items-center gap-3">
                    {onPageSizeChange && (
                        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            Rows
                            <select
                                value={safePageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            >
                                {pageSizeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={!canGoPrev}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="text-sm font-medium text-[var(--text-primary)] min-w-20 text-center">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={!canGoNext}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}