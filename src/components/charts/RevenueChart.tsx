"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenueDataPoint } from "@/data/revenue";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-animate on theme change
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [theme]);

  if (!mounted) {
    return <ChartSkeleton />;
  }

  const isDark = theme === "dark";

  const colors = {
    revenue: "#3B82F6",
    target: "#22C55E",
    grid: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)",
    text: isDark ? "#94A3B8" : "#64748B",
    tooltipBg: isDark ? "#1E293B" : "#FFFFFF",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0",
  };

  return (
    <m.div
      key={animationKey}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-[300px] lg:h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.revenue} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.target} stopOpacity={0.2} />
              <stop offset="95%" stopColor={colors.target} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.text, fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.text, fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            labelStyle={{ color: colors.text, fontWeight: 600, marginBottom: 4 }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === "revenue" ? "Revenue" : "Target",
            ]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: colors.text, fontSize: 12 }}>
                {value === "revenue" ? "Revenue" : "Target"}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke={colors.target}
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#targetGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={colors.revenue}
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </m.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}
