"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CashflowDataPoint {
  month: string;
  inflow: number;
  outflow: number;
}

interface CashflowChartProps {
  data: CashflowDataPoint[];
}

export function CashflowChart({ data }: CashflowChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [theme]);

  if (!mounted) {
    return <ChartSkeleton />;
  }

  const isDark = theme === "dark";

  // Calculate net cashflow
  const dataWithNet = data.map((item) => ({
    ...item,
    net: item.inflow - item.outflow,
  }));

  const colors = {
    inflow: "#22C55E",
    outflow: "#EF4444",
    net: "#3B82F6",
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
        <ComposedChart
          data={dataWithNet}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.net} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.net} stopOpacity={0} />
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
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                inflow: "Cash Inflow",
                outflow: "Cash Outflow",
                net: "Net Cashflow",
              };
              return [`$${value.toLocaleString()}`, labels[name] || name];
            }}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              const labels: Record<string, string> = {
                inflow: "Cash Inflow",
                outflow: "Cash Outflow",
                net: "Net Cashflow",
              };
              return (
                <span style={{ color: colors.text, fontSize: 12 }}>
                  {labels[value] || value}
                </span>
              );
            }}
          />
          <Bar
            dataKey="inflow"
            fill={colors.inflow}
            fillOpacity={0.8}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="outflow"
            fill={colors.outflow}
            fillOpacity={0.8}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={200}
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke={colors.net}
            strokeWidth={2.5}
            fill="url(#netGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={400}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </m.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}
