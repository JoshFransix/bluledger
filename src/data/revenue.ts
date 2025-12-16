export const revenueData = [
  { month: "Jan", revenue: 186000, target: 175000 },
  { month: "Feb", revenue: 215000, target: 195000 },
  { month: "Mar", revenue: 247000, target: 220000 },
  { month: "Apr", revenue: 232000, target: 230000 },
  { month: "May", revenue: 289000, target: 250000 },
  { month: "Jun", revenue: 324000, target: 275000 },
  { month: "Jul", revenue: 356000, target: 300000 },
  { month: "Aug", revenue: 378000, target: 325000 },
  { month: "Sep", revenue: 412000, target: 350000 },
  { month: "Oct", revenue: 445000, target: 380000 },
  { month: "Nov", revenue: 489000, target: 420000 },
  { month: "Dec", revenue: 534000, target: 460000 },
];

export const monthlyRevenue = [
  { name: "Week 1", value: 124500 },
  { name: "Week 2", value: 145200 },
  { name: "Week 3", value: 132800 },
  { name: "Week 4", value: 131500 },
];

export type RevenueDataPoint = (typeof revenueData)[number];
export type MonthlyRevenuePoint = (typeof monthlyRevenue)[number];
