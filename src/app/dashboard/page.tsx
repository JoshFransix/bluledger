"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { KPIGroup } from "@/components/dashboard/KPIGroup";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import {
  DynamicRevenueChart,
  DynamicExpensesChart,
  DynamicCashflowChart,
} from "@/components/charts";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useMemo } from "react";

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse bg-secondary/50 rounded-lg"
        />
      ))}
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse bg-secondary/50 rounded-lg"
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { accounts, isLoading: accountsLoading } = useAccounts();

  // Calculate KPI data from real transactions and accounts
  const kpiData = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= lastMonth);
    const previousMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()) && d < lastMonth;
    });

    const currentRevenue = currentMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const previousRevenue = previousMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const previousExpenses = previousMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
    const activeAccounts = accounts.filter(a => a.isActive).length;

    return {
      totalRevenue: {
        value: currentRevenue,
        change: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
        trend: (currentRevenue >= previousRevenue ? "up" : "down") as const,
      },
      totalExpenses: {
        value: currentExpenses,
        change: previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0,
        trend: (currentExpenses <= previousExpenses ? "down" : "up") as const,
      },
      netProfit: {
        value: currentRevenue - currentExpenses,
        change: 8.7,
        trend: "up" as const,
      },
      activeClients: {
        value: activeAccounts,
        change: 5.2,
        trend: "up" as const,
      },
    };
  }, [transactions, accounts]);

  // Prepare revenue chart data
  const revenueData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'INCOME')
      .forEach(t => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(t.amount);
      });

    return Object.entries(monthlyData).map(([month, value]) => ({ month, value })).slice(-6);
  }, [transactions]);

  // Prepare expenses chart data
  const expensesData = useMemo(() => {
    const monthlyData: Record<string, { actual: number; budget: number }> = {};
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { actual: 0, budget: 0 };
        }
        monthlyData[monthKey].actual += parseFloat(t.amount);
        monthlyData[monthKey].budget = monthlyData[monthKey].actual * 1.2; // Mock budget
      });

    return Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })).slice(-6);
  }, [transactions]);

  // Prepare cashflow chart data
  const cashflowData = useMemo(() => {
    const monthlyData: Record<string, { month: string; income: number; expenses: number; net: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expenses: 0, net: 0 };
      }
      
      if (t.type === 'INCOME') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else if (t.type === 'EXPENSE') {
        monthlyData[monthKey].expenses += parseFloat(t.amount);
      }
    });

    return Object.values(monthlyData).map(d => ({
      ...d,
      net: d.income - d.expenses,
    })).slice(-12);
  }, [transactions]);

  // Format transactions for display
  const formattedTransactions = useMemo(() => {
    return transactions.slice(0, 10).map(t => ({
      id: t.id,
      description: t.description || `${t.type} Transaction`,
      amount: parseFloat(t.amount),
      type: t.type === 'INCOME' ? 'income' as const : 'expense' as const,
      category: t.category || 'Uncategorized',
      date: t.date,
      status: 'completed' as const,
    }));
  }, [transactions]);

  const isLoading = transactionsLoading || accountsLoading;

  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your finances."
      >
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-primary text-primary-foreground hover:bg-primary/90 
                           transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </PageHeader>

      {/* KPI Cards */}
      <section className="mb-6 lg:mb-8">
        {isLoading ? <KPISkeleton /> : <KPIGroup data={kpiData} />}
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? <ChartSkeleton /> : <DynamicRevenueChart data={revenueData} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses vs Budget</CardTitle>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? <ChartSkeleton /> : <DynamicExpensesChart data={expensesData} />}
          </CardContent>
        </Card>
      </section>

      {/* Cashflow Timeline */}
      <section className="mb-6 lg:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cashflow Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-1.5 rounded-lg bg-secondary border-0 text-sm 
                                 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="12m">Last 12 months</option>
                <option value="6m">Last 6 months</option>
                <option value="3m">Last 3 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <ChartSkeleton /> : <DynamicCashflowChart data={cashflowData} />}
          </CardContent>
        </Card>
      </section>

      {/* Recent Transactions */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest financial activities
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 
                               transition-colors text-sm font-medium"
            >
              View All
            </button>
          </CardHeader>
          <CardContent className="p-0 lg:p-0">
            {isLoading ? <TableSkeleton /> : <TransactionsTable transactions={formattedTransactions} />}
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
