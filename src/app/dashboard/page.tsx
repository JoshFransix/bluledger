import { Suspense } from "react";
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
import {
  getKPIData,
  getRevenueData,
  getExpensesData,
  getCashflowData,
  getTransactions,
} from "@/lib/data";
import { Download, Filter, RefreshCw } from "lucide-react";

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

export default async function DashboardPage() {
  // Parallel data fetching with caching
  const [kpiData, revenueData, expensesData, cashflowData, transactions] =
    await Promise.all([
      getKPIData(),
      getRevenueData(),
      getExpensesData(),
      getCashflowData(),
      getTransactions(10),
    ]);

  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your finances."
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-primary text-primary-foreground hover:bg-primary/90 
                           transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </PageHeader>

      {/* KPI Cards */}
      <section className="mb-6 lg:mb-8">
        <Suspense fallback={<KPISkeleton />}>
          <KPIGroup data={kpiData} />
        </Suspense>
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
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicRevenueChart data={revenueData} />
            </Suspense>
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
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicExpensesChart data={expensesData} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Cashflow Timeline */}
      <section className="mb-6 lg:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cashflow Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 rounded-lg bg-secondary border-0 text-sm 
                                 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="12m">Last 12 months</option>
                <option value="6m">Last 6 months</option>
                <option value="3m">Last 3 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicCashflowChart data={cashflowData} />
            </Suspense>
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
            <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 
                               transition-colors text-sm font-medium">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-0 lg:p-0">
            <Suspense fallback={<TableSkeleton />}>
              <TransactionsTable transactions={transactions} />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse bg-secondary/50 rounded-xl"
        />
      ))}
    </div>
  );
}
