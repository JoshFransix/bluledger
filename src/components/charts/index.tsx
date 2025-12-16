"use client";

import dynamic from "next/dynamic";
import type { RevenueDataPoint } from "@/data/revenue";
import type { ExpensesDataPoint } from "@/data/expenses";

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}

export const DynamicRevenueChart = dynamic(
  () =>
    import("@/components/charts/RevenueChart").then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export const DynamicExpensesChart = dynamic(
  () =>
    import("@/components/charts/ExpensesChart").then(
      (mod) => mod.ExpensesChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export const DynamicCashflowChart = dynamic(
  () =>
    import("@/components/charts/CashflowChart").then(
      (mod) => mod.CashflowChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export const DynamicExpensesCategoryChart = dynamic(
  () =>
    import("@/components/charts/ExpensesCategoryChart").then(
      (mod) => mod.ExpensesCategoryChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// Re-export types for convenience
export type { RevenueDataPoint, ExpensesDataPoint };
