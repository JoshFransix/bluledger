"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTransition } from "@/components/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import {
  DynamicRevenueChart,
  DynamicExpensesChart,
  DynamicCashflowChart,
  DynamicExpensesCategoryChart,
} from "@/components/charts";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useMemo, useState } from "react";
import {
  Download,
  Calendar,
  ChevronDown,
  FileBarChart,
  Plus,
} from "lucide-react";
import { DateRangePicker, Button } from "@heroui/react";

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}

export default function ReportsPage() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const [dateRange, setDateRange] = useState<{
    start: any;
    end: any;
  } | null>(null);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return transactions;

    const startDate = new Date(
      dateRange.start.year,
      dateRange.start.month - 1,
      dateRange.start.day
    );
    const endDate = new Date(
      dateRange.end.year,
      dateRange.end.month - 1,
      dateRange.end.day
    );

    return transactions.filter((t: any) => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= endDate;
    });
  }, [transactions, dateRange]);

  // Calculate summary statistics from real data
  const summaryStats = useMemo(() => {
    const now = new Date();
    const lastYear = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    const currentYearTransactions = filteredTransactions.filter(
      (t: any) => new Date(t.date) >= lastYear
    );
    const previousYearStart = new Date(lastYear);
    previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    const previousYearTransactions = filteredTransactions.filter(
      (t: any) =>
        new Date(t.date) >= previousYearStart && new Date(t.date) < lastYear
    );

    const currentRevenue = currentYearTransactions
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const previousRevenue = previousYearTransactions
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const currentExpenses = currentYearTransactions
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const previousExpenses = previousYearTransactions
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const netProfit = currentRevenue - currentExpenses;
    const previousNetProfit = previousRevenue - previousExpenses;
    const profitMargin =
      currentRevenue > 0 ? (netProfit / currentRevenue) * 100 : 0;
    const previousProfitMargin =
      previousRevenue > 0 ? (previousNetProfit / previousRevenue) * 100 : 0;

    return {
      revenue: {
        value: currentRevenue,
        change:
          previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : 0,
      },
      expenses: {
        value: currentExpenses,
        change:
          previousExpenses > 0
            ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
            : 0,
      },
      netProfit: {
        value: netProfit,
        change:
          previousNetProfit > 0
            ? ((netProfit - previousNetProfit) / previousNetProfit) * 100
            : 0,
      },
      profitMargin: {
        value: profitMargin,
        change: profitMargin - previousProfitMargin,
      },
    };
  }, [filteredTransactions]);

  // Prepare revenue chart data
  const revenueData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    filteredTransactions
      .filter((t: any) => t.type === "INCOME")
      .forEach((t: any) => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString("default", { month: "short" });
        monthlyData[monthKey] =
          (monthlyData[monthKey] || 0) + parseFloat(t.amount);
      });

    return Object.entries(monthlyData)
      .map(([month, value]) => ({
        month,
        revenue: value,
        target: value * 1.1, // 10% above actual as target
      }))
      .slice(-12);
  }, [filteredTransactions]);

  // Prepare expenses chart data
  const expensesData = useMemo(() => {
    const monthlyData: Record<string, { expenses: number; budget: number }> =
      {};
    filteredTransactions
      .filter((t: any) => t.type === "EXPENSE")
      .forEach((t: any) => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString("default", { month: "short" });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { expenses: 0, budget: 0 };
        }
        monthlyData[monthKey].expenses += parseFloat(t.amount);
        monthlyData[monthKey].budget = monthlyData[monthKey].expenses * 1.15; // 15% buffer
      });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .slice(-12);
  }, [filteredTransactions]);

  // Prepare expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryData: Record<string, number> = {};
    filteredTransactions
      .filter((t: any) => t.type === "EXPENSE")
      .forEach((t: any) => {
        const category = t.category || "Uncategorized";
        categoryData[category] =
          (categoryData[category] || 0) + parseFloat(t.amount);
      });

    const totalExpenses = Object.values(categoryData).reduce(
      (sum: number, amount: number) => sum + amount,
      0
    );

    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 categories
  }, [filteredTransactions]);

  // Prepare cashflow chart data
  const cashflowData = useMemo(() => {
    const monthlyData: Record<
      string,
      { month: string; inflow: number; outflow: number; net: number }
    > = {};
    filteredTransactions.forEach((t: any) => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleString("default", { month: "short" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          inflow: 0,
          outflow: 0,
          net: 0,
        };
      }

      if (t.type === "INCOME") {
        monthlyData[monthKey].inflow += parseFloat(t.amount);
      } else if (t.type === "EXPENSE") {
        monthlyData[monthKey].outflow += parseFloat(t.amount);
      }
    });

    return Object.values(monthlyData)
      .map((d) => ({ ...d, net: d.inflow - d.outflow }))
      .slice(-12);
  }, [filteredTransactions]);

  const isLoading = transactionsLoading || accountsLoading;
  const hasData = filteredTransactions.length > 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <DashboardLayout title="Reports">
      <PageTransition>
        <PageHeader
          title="Financial Reports"
          description="Detailed analytics and insights from your real transaction data"
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* <Button
              startContent={<Plus className="w-4 h-4" />}
              color="default"
              variant="bordered"
              size="sm"
            >
              Add Account
            </Button> */}
            <DateRangePicker
              label="Date Range"
              variant="bordered"
              value={dateRange}
              onChange={setDateRange}
              showMonthAndYearPickers
              visibleMonths={2}
              classNames={{
                base: "max-w-xs",
                input: "text-sm",
              }}
            />
            {dateRange && (
              <Button
                size="sm"
                variant="flat"
                onPress={() => setDateRange(null)}
              >
                Clear Filter
              </Button>
            )}
            <Button
              startContent={<Download className="w-4 h-4" />}
              color="primary"
              size="sm"
              isDisabled
            >
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </PageHeader>

        {!isLoading && !hasData ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileBarChart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-6">
                Create transactions to see detailed financial reports and
                analytics
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-secondary/50 rounded-lg animate-pulse"
                  />
                ))
              ) : (
                <>
                  <SummaryCard
                    title="Total Revenue"
                    value={formatCurrency(summaryStats.revenue.value)}
                    change={formatPercent(summaryStats.revenue.change)}
                    positive={summaryStats.revenue.change >= 0}
                  />
                  <SummaryCard
                    title="Total Expenses"
                    value={formatCurrency(summaryStats.expenses.value)}
                    change={formatPercent(summaryStats.expenses.change)}
                    positive={summaryStats.expenses.change <= 0}
                  />
                  <SummaryCard
                    title="Net Profit"
                    value={formatCurrency(summaryStats.netProfit.value)}
                    change={formatPercent(summaryStats.netProfit.change)}
                    positive={summaryStats.netProfit.change >= 0}
                  />
                  <SummaryCard
                    title="Profit Margin"
                    value={`${summaryStats.profitMargin.value.toFixed(1)}%`}
                    change={formatPercent(summaryStats.profitMargin.change)}
                    positive={summaryStats.profitMargin.change >= 0}
                  />
                </>
              )}
            </section>

            {/* Revenue Analysis */}
            <section className="mb-6 lg:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                  <CardDescription>
                    Monthly revenue from your income transactions over the past
                    year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <DynamicRevenueChart data={revenueData} />
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Expenses Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses vs Budget</CardTitle>
                  <CardDescription>
                    Track spending with estimated budgets based on your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <DynamicExpensesChart data={expensesData} />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>
                    Breakdown of expenses across different transaction
                    categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <DynamicExpensesCategoryChart data={expensesByCategory} />
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Cashflow */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>
                    Track cash inflows, outflows, and net position from your
                    transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <DynamicCashflowChart data={cashflowData} />
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </PageTransition>
    </DashboardLayout>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

function SummaryCard({ title, value, change, positive }: SummaryCardProps) {
  return (
    <Card className="p-4 lg:p-5">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <span
        className={`text-sm font-medium ${
          positive ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {change} from last year
      </span>
    </Card>
  );
}
