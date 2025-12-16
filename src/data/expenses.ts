export const expensesData = [
  { month: "Jan", expenses: 124000, budget: 130000 },
  { month: "Feb", expenses: 138000, budget: 140000 },
  { month: "Mar", expenses: 152000, budget: 150000 },
  { month: "Apr", expenses: 145000, budget: 155000 },
  { month: "May", expenses: 168000, budget: 165000 },
  { month: "Jun", expenses: 175000, budget: 175000 },
  { month: "Jul", expenses: 189000, budget: 185000 },
  { month: "Aug", expenses: 198000, budget: 195000 },
  { month: "Sep", expenses: 212000, budget: 210000 },
  { month: "Oct", expenses: 225000, budget: 220000 },
  { month: "Nov", expenses: 238000, budget: 235000 },
  { month: "Dec", expenses: 254000, budget: 250000 },
];

export const expensesByCategory = [
  { category: "Salaries", amount: 845000, percentage: 42 },
  { category: "Marketing", amount: 324000, percentage: 16 },
  { category: "Operations", amount: 268000, percentage: 13 },
  { category: "Technology", amount: 245000, percentage: 12 },
  { category: "Office", amount: 186000, percentage: 9 },
  { category: "Other", amount: 164000, percentage: 8 },
];

export type ExpensesDataPoint = (typeof expensesData)[number];
export type ExpenseCategory = (typeof expensesByCategory)[number];
