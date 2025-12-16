"use client";

import { m } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Wallet,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";

interface KPIData {
  totalRevenue: { value: number; change: number; trend: "up" | "down" };
  totalExpenses: { value: number; change: number; trend: "up" | "down" };
  netProfit: { value: number; change: number; trend: "up" | "down" };
  activeClients: { value: number; change: number; trend: "up" | "down" };
}

interface KPIGroupProps {
  data: KPIData;
}

const kpiConfig = [
  {
    key: "totalRevenue" as const,
    title: "Total Revenue",
    icon: DollarSign,
    format: formatCurrency,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    key: "totalExpenses" as const,
    title: "Total Expenses",
    icon: CreditCard,
    format: formatCurrency,
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  {
    key: "netProfit" as const,
    title: "Net Profit",
    icon: Wallet,
    format: formatCurrency,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    key: "activeClients" as const,
    title: "Active Clients",
    icon: Users,
    format: (v: number) => v.toLocaleString(),
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
];

export function KPIGroup({ data }: KPIGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {kpiConfig.map((config, index) => {
        const kpiData = data[config.key];
        return (
          <KPICard
            key={config.key}
            title={config.title}
            value={kpiData.value}
            change={kpiData.change}
            trend={kpiData.trend}
            icon={config.icon}
            format={config.format}
            iconBg={config.iconBg}
            iconColor={config.iconColor}
            delay={index * 0.1}
          />
        );
      })}
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  format: (value: number) => string;
  iconBg: string;
  iconColor: string;
  delay?: number;
}

function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  format,
  iconBg,
  iconColor,
  delay = 0,
}: KPICardProps) {
  const isPositive = trend === "up";

  return (
    <m.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className={cn(
        "bg-card rounded-xl border border-border p-5 lg:p-6",
        "transition-all duration-300",
        "hover:border-primary/30 hover:shadow-lg dark:hover:shadow-primary/5"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isPositive
              ? "text-success bg-success/10"
              : "text-destructive bg-destructive/10"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{formatPercentage(change)}</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold tracking-tight">
          <AnimatedNumber value={value} duration={1.2} formatValue={format} />
        </p>
      </div>
    </m.div>
  );
}
