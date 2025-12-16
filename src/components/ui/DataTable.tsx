"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  className,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                  "text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <m.tr
              key={item.id ?? index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "border-b border-border/50 last:border-0",
                "hover:bg-secondary/30 transition-colors duration-200",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn("px-4 py-3 text-sm", column.className)}
                >
                  {column.render
                    ? column.render(item, index)
                    : String(item[column.key as keyof T] ?? "")}
                </td>
              ))}
            </m.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
