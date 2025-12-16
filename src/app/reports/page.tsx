import { Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import {
  DynamicRevenueChart,
  DynamicExpensesChart,
  DynamicCashflowChart,
  DynamicExpensesCategoryChart,
} from "@/components/charts";
import {
  getRevenueData,
  getExpensesData,
  getCashflowData,
  getExpensesByCategory,
} from "@/lib/data";
import { Download, Calendar, ChevronDown } from "lucide-react";

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}

export default async function ReportsPage() {
  const [revenueData, expensesData, cashflowData, expensesByCategory] =
    await Promise.all([
      getRevenueData(),
      getExpensesData(),
      getCashflowData(),
      getExpensesByCategory(),
    ]);

  return (
    <DashboardLayout title="Reports">
      <PageHeader
        title="Financial Reports"
        description="Detailed analytics and insights for your business"
      >
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                             bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Last 12 months</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                             bg-primary text-primary-foreground hover:bg-primary/90 
                             transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
        <SummaryCard
          title="Total Revenue"
          value="$2,847,563"
          change="+12.5%"
          positive
        />
        <SummaryCard
          title="Total Expenses"
          value="$1,234,567"
          change="-3.2%"
          positive
        />
        <SummaryCard
          title="Net Profit"
          value="$1,612,996"
          change="+24.8%"
          positive
        />
        <SummaryCard
          title="Profit Margin"
          value="56.7%"
          change="+5.3%"
          positive
        />
      </section>

      {/* Revenue Analysis */}
      <section className="mb-6 lg:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>
              Monthly revenue compared to targets over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicRevenueChart data={revenueData} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Expenses Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Expenses vs Budget</CardTitle>
            <CardDescription>
              Track spending against allocated budgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicExpensesChart data={expensesData} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              Breakdown of expenses across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicExpensesCategoryChart data={expensesByCategory} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Cashflow */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>
              Track cash inflows, outflows, and net position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicCashflowChart data={cashflowData} />
            </Suspense>
          </CardContent>
        </Card>
      </section>
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
          positive ? "text-success" : "text-destructive"
        }`}
      >
        {change} from last year
      </span>
    </Card>
  );
}
