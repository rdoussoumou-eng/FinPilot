-- Tableau de Bord Financier Premium — schéma Supabase (Postgres)
-- À exécuter une fois dans : Supabase Dashboard > SQL Editor > New query > Run.
-- Toutes les tables sont protégées par Row Level Security : chaque utilisateur
-- ne voit et ne modifie que ses propres lignes (auth.uid() = user_id).

create extension if not exists pgcrypto; -- fournit gen_random_uuid() ; déjà actif par défaut sur Supabase, mais sans risque si déjà présent.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  monthly_budget integer not null default 0, -- FCFA, unité entière (pas de sous-unité)
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  target_amount integer not null default 0,
  current_amount integer not null default 0,
  target_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  occurred_on date not null,
  label text not null,
  category_id uuid references public.categories(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  amount integer not null, -- FCFA signé : positif = revenu, négatif = dépense
  payment_mode text,
  status text not null default 'cleared' check (status in ('cleared','pending')),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, occurred_on desc);

alter table public.categories enable row level security;
alter table public.accounts enable row level security;
alter table public.goals enable row level security;
alter table public.transactions enable row level security;

-- Une politique par opération : les lectures/écritures ne portent jamais que
-- sur les lignes dont user_id correspond à l'utilisateur connecté.
create policy "categories: owner only" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts: owner only" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals: owner only" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions: owner only" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
