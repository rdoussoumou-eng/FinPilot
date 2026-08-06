export interface Kpi {
  id: string;
  label: string;
  value: number;
  format: "money" | "percent";
  deltaPct: number; // vs. previous month, e.g. 0.128 = +12.8%
  goodDirection: "up" | "down"; // whether an increase is good or bad for this metric
  icon: IconName;
}

export interface Transaction {
  id: string;
  date: Date;
  category: string;
  label: string;
  account: string;
  amount: number; // negative = expense
  status: "cleared" | "pending";
  /** Raw fields needed to populate an edit form — only set on the Transactions page. */
  occurredOn?: string;
  categoryId?: string | null;
  accountId?: string | null;
  paymentMode?: string | null;
}

export interface CategorySpend {
  category: string;
  icon: IconName;
  amount: number;
  sharePct: number;
  deltaPct: number;
}

export type IconName =
  | "wallet" | "trendingUp" | "trendingDown" | "piggyBank" | "target" | "barChart"
  | "search" | "bell" | "moon" | "sun" | "settings" | "chevronRight" | "plus"
  | "food" | "car" | "home" | "graduation" | "party" | "phone" | "bolt" | "wifi"
  | "calendar" | "sparkles" | "arrowRight" | "checkCircle" | "clock" | "menu" | "x" | "info" | "edit";
