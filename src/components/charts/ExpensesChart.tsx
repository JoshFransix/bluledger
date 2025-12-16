"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import type { ExpensesDataPoint } from "@/data/expenses";

interface ExpensesChartProps {
  data: ExpensesDataPoint[];
}

export function ExpensesChart({ data }: ExpensesChartProps) {
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

  const colors = {
    expenses: "#EF4444",
    budget: "#F59E0B",
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
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          barGap={4}
        >
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
            labelStyle={{
              color: colors.text,
              fontWeight: 600,
              marginBottom: 4,
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === "expenses" ? "Expenses" : "Budget",
            ]}
            cursor={{
              fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: colors.text, fontSize: 12 }}>
                {value === "expenses" ? "Expenses" : "Budget"}
              </span>
            )}
          />
          <Bar
            dataKey="budget"
            fill={colors.budget}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell key={`budget-${index}`} fillOpacity={0.6} />
            ))}
          </Bar>
          <Bar
            dataKey="expenses"
            fill={colors.expenses}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell
                key={`expenses-${index}`}
                fill={entry.expenses > entry.budget ? "#EF4444" : "#22C55E"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </m.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}
