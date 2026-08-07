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
  -- true for accounts like "Remboursements": transactions still show in the
  -- ledger and in this account's own balance, but are excluded from budget,
  -- KPI and analysis totals so they don't distort real spending numbers.
  exclude_from_totals boolean not null default false,
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

-- Liste blanche d'emails autorisés à créer un compte. Gérée depuis
-- Paramètres → Accès autorisés (n'importe quel utilisateur déjà connecté
-- peut ajouter/retirer une adresse — application à petite échelle, cercle de
-- confiance). Le déclencheur ci-dessous bloque toute inscription (via l'app
-- ou un appel direct à l'API Supabase) dont l'email n'y figure pas.
create table if not exists public.allowed_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

alter table public.allowed_emails enable row level security;

create policy "allowed_emails: authenticated can view" on public.allowed_emails
  for select to authenticated using (true);
create policy "allowed_emails: authenticated can add" on public.allowed_emails
  for insert to authenticated with check (true);
create policy "allowed_emails: authenticated can remove" on public.allowed_emails
  for delete to authenticated using (true);

create or replace function public.check_allowed_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.allowed_emails where lower(email) = lower(new.email)) then
    raise exception 'signup_not_allowed';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_allowed_email on auth.users;
create trigger enforce_allowed_email
  before insert on auth.users
  for each row execute function public.check_allowed_email();
