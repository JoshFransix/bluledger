import { revenueData, monthlyRevenue } from "@/data/revenue";
import { expensesData, expensesByCategory } from "@/data/expenses";
import { transactionsData, type Transaction } from "@/data/transactions";

// Simulated delay for realistic data fetching
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRevenueData() {
  await delay(100);
  return revenueData;
}

export async function getMonthlyRevenue() {
  await delay(100);
  return monthlyRevenue;
}

export async function getExpensesData() {
  await delay(100);
  return expensesData;
}

export async function getExpensesByCategory() {
  await delay(100);
  return expensesByCategory;
}

export async function getTransactions(limit?: number): Promise<Transaction[]> {
  await delay(150);
  if (limit) {
    return transactionsData.slice(0, limit);
  }
  return transactionsData;
}

export async function getKPIData() {
  await delay(100);
  return {
    totalRevenue: {
      value: 2847563,
      change: 12.5,
      trend: "up" as const,
    },
    totalExpenses: {
      value: 1234567,
      change: -3.2,
      trend: "down" as const,
    },
    netProfit: {
      value: 1612996,
      change: 24.8,
      trend: "up" as const,
    },
    activeClients: {
      value: 1284,
      change: 8.1,
      trend: "up" as const,
    },
  };
}

export async function getCashflowData() {
  await delay(100);
  return [
    { month: "Jan", inflow: 245000, outflow: 180000 },
    { month: "Feb", inflow: 285000, outflow: 195000 },
    { month: "Mar", inflow: 310000, outflow: 210000 },
    { month: "Apr", inflow: 295000, outflow: 188000 },
    { month: "May", inflow: 340000, outflow: 225000 },
    { month: "Jun", inflow: 385000, outflow: 240000 },
    { month: "Jul", inflow: 420000, outflow: 265000 },
    { month: "Aug", inflow: 445000, outflow: 280000 },
    { month: "Sep", inflow: 480000, outflow: 295000 },
    { month: "Oct", inflow: 510000, outflow: 310000 },
    { month: "Nov", inflow: 545000, outflow: 325000 },
    { month: "Dec", inflow: 590000, outflow: 350000 },
  ];
}

export async function getTeamMembers() {
  await delay(100);
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@bluledger.com",
      role: "Admin",
      avatar: null,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@bluledger.com",
      role: "Analyst",
      avatar: null,
      status: "active" as const,
    },
    {
      id: "3",
      name: "Emily Williams",
      email: "emily@bluledger.com",
      role: "Viewer",
      avatar: null,
      status: "active" as const,
    },
    {
      id: "4",
      name: "David Brown",
      email: "david@bluledger.com",
      role: "Editor",
      avatar: null,
      status: "pending" as const,
    },
  ];
}

export async function getInvoices() {
  await delay(100);
  return [
    {
      id: "INV-001",
      date: "2024-12-01",
      amount: 299,
      status: "paid" as const,
      description: "Pro Plan - December 2024",
    },
    {
      id: "INV-002",
      date: "2024-11-01",
      amount: 299,
      status: "paid" as const,
      description: "Pro Plan - November 2024",
    },
    {
      id: "INV-003",
      date: "2024-10-01",
      amount: 299,
      status: "paid" as const,
      description: "Pro Plan - October 2024",
    },
    {
      id: "INV-004",
      date: "2024-09-01",
      amount: 199,
      status: "paid" as const,
      description: "Starter Plan - September 2024",
    },
  ];
}
