export interface CategoryRow {
  id: string;
  name: string;
  monthly_budget: number;
}

export interface AccountRow {
  id: string;
  name: string;
}

export interface GoalRow {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

export interface AllowedEmailRow {
  email: string;
  added_at: string;
}

export interface TransactionRow {
  id: string;
  occurred_on: string; // ISO date
  label: string;
  category_id: string | null;
  account_id: string | null;
  amount: number; // signed FCFA
  payment_mode: string | null;
  status: "cleared" | "pending";
}

/** Default categories/accounts seeded for a brand-new account — mirrors the
 *  original workbook's Paramètres lists so the app isn't empty on first login. */
export const DEFAULT_CATEGORIES = [
  "Alimentation", "Transport", "Loyer", "Santé", "Téléphone", "Internet",
  "Électricité", "Église", "Famille", "Investissement", "Épargne", "Loisirs", "Formation", "Autres",
];
export const DEFAULT_ACCOUNTS = ["Espèces", "Banque", "Orange Money", "Wave", "Mobile Money"];
export const DEFAULT_MONTHLY_BUDGET = 40000;
