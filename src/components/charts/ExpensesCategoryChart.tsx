"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpensesCategoryChartProps {
  data: ExpenseCategory[];
}

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#EC4899",
];

export function ExpensesCategoryChart({ data }: ExpensesCategoryChartProps) {
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
    text: isDark ? "#94A3B8" : "#64748B",
    tooltipBg: isDark ? "#1E293B" : "#FFFFFF",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0",
  };

  // Transform data to satisfy Recharts type requirements
  const chartData = data.map((item) => ({
    ...item,
    name: item.category,
    value: item.amount,
  }));

  return (
    <m.div
      key={animationKey}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-[300px] lg:h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="amount"
            nameKey="category"
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            formatter={(
              value: number | undefined,
              name: string | undefined
            ) => [`$${(value || 0).toLocaleString()}`, name || ""]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span style={{ color: colors.text, fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </m.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] lg:h-[350px] animate-pulse bg-secondary/50 rounded-lg" />
  );
}
