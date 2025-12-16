"use client";

import { m } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, getRelativeTime, cn } from "@/lib/utils";
import type { Transaction } from "@/data/transactions";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Transaction
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <m.tr
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors duration-200"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      transaction.type === "income"
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-muted-foreground">
                  {transaction.category}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-muted-foreground">
                  {getRelativeTime(transaction.date)}
                </span>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={transaction.status} />
              </td>
              <td className="px-4 py-4 text-right">
                <span
                  className={cn(
                    "font-semibold text-sm",
                    transaction.type === "income" ? "text-success" : "text-foreground"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
            </m.tr>
          ))}
        </tbody>
      </table>
    </m.div>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const config = {
    completed: {
      label: "Completed",
      className: "bg-success/10 text-success",
    },
    pending: {
      label: "Pending",
      className: "bg-warning/10 text-warning",
    },
    failed: {
      label: "Failed",
      className: "bg-destructive/10 text-destructive",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}
