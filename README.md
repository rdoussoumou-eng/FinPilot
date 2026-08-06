# Tableau de Bord Financier Premium

Application Next.js 14 (App Router) + TypeScript + Tailwind, avec authentification et
base de données réelles (Supabase), installable comme application sur Android via PWA.

**Important — cet environnement de développement n'a ni Node.js ni npm** : tout le code
ci-dessous est écrit mais n'a jamais été compilé ni exécuté ici. Suivez les étapes
« Mise en route » sur votre propre machine pour le tester avant de déployer.

## Ce qui est réellement fonctionnel aujourd'hui

Les 9 pages sont branchées sur de vraies requêtes Supabase — rien n'affiche de valeur
figée ; les conseils IA sont calculés depuis les transactions réelles (`src/lib/insights.ts`),
jamais du texte écrit à l'avance.

| Page | État |
|---|---|
| **Accueil** (`/`) | KPI, transactions récentes, conseils IA, objectifs |
| **Transactions** (`/transactions`) | Liste, recherche en direct, ajout, suppression |
| **Tableau de bord** (`/dashboard`) | KPI + 6 graphiques pour un mois/année choisis |
| **Budget mensuel** (`/budget`) | Réel vs prévu par catégorie, barres de progression |
| **Comptes** (`/comptes`) | Solde par compte, part du total |
| **Objectifs** (`/objectifs`) | Création, suivi, suppression |
| **Analyses** (`/analyses`) | Top 10 dépenses, répartition par catégorie, tableau mensuel, indicateurs |
| **Historique annuel** (`/historique`) | Revenus/dépenses par année (2024-2028) |
| **Paramètres** (`/parametres`) | Catégories et comptes en lecture seule — l'édition reste à faire |

Un compte flambant neuf commence avec 14 catégories et 5 comptes par défaut
(mêmes noms que le classeur Excel d'origine) créés automatiquement à la première connexion,
mais aucune transaction, objectif ni budget personnalisé — tout le reste s'affiche vide
jusqu'à ce que vous saisissiez vos propres données.

## 1. Créer le backend (Supabase — gratuit)

1. Allez sur [supabase.com](https://supabase.com), créez un compte et un nouveau projet.
2. Dans **SQL Editor**, collez le contenu de [`supabase/schema.sql`](supabase/schema.sql) et exécutez-le. Cela crée les tables `categories`, `accounts`, `goals`, `transactions`, toutes protégées par Row Level Security (chaque utilisateur ne voit que ses propres données).
3. Dans **Project Settings > API**, copiez `Project URL` et la clé `anon public`.
4. Dans **Authentication > Providers**, l'inscription par email/mot de passe est activée par défaut — rien à faire.
5. Par défaut, Supabase exige de cliquer un lien de confirmation reçu par email avant la première connexion. Pour un usage personnel où vous voulez vous connecter immédiatement après inscription, désactivez ceci dans **Authentication > Settings > Confirm email** (à réactiver si l'app est un jour ouverte à d'autres utilisateurs).

## 2. Configurer le projet en local

```bash
cd webapp
cp .env.local.example .env.local
# collez Project URL et anon key dans .env.local

npm install
npx shadcn@latest add button input badge avatar dropdown-menu sheet
npm install -D tailwindcss-animate

npm run dev
```

Ouvrez `http://localhost:3000`, créez un compte (email/mot de passe) — un jeu de
catégories et comptes par défaut est créé automatiquement à la première connexion.

## 3. Déployer (Vercel — gratuit)

```bash
git init && git add -A && git commit -m "Initial commit"
```

Poussez sur GitHub, puis sur [vercel.com](https://vercel.com) : **New Project** → importez
le dépôt → dans **Environment Variables**, ajoutez `NEXT_PUBLIC_SUPABASE_URL` et
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (mêmes valeurs que `.env.local`) → **Deploy**.

Vous obtenez une adresse `https://votre-app.vercel.app` — c'est votre application, en ligne, en HTTPS.

## 4. Installer sur Android

1. Ouvrez l'adresse Vercel dans **Chrome** sur votre téléphone Android.
2. Connectez-vous.
3. Chrome propose automatiquement **« Ajouter à l'écran d'accueil »** (ou : menu ⋮ → **Installer l'application**).
4. L'icône apparaît sur l'écran d'accueil et l'app s'ouvre en plein écran, sans barre d'adresse.

Ce qui rend ça possible : [`public/manifest.json`](public/manifest.json) (nom, icône,
couleurs, mode `standalone`) et [`public/sw.js`](public/sw.js) (service worker minimal —
met en cache les fichiers statiques et affiche une page hors-ligne propre si la
connexion coupe ; il ne met jamais en cache vos données financières, pour éviter
d'afficher des chiffres périmés).

## Architecture

```
src/
  app/
    login/                    connexion / inscription (Server Actions)
    (dashboard)/
      layout.tsx               garde d'authentification + sidebar
      page.tsx                 Accueil
      transactions/            liste + recherche + ajout/suppression (Server Actions)
      dashboard/                KPI + 6 graphiques, sélecteur mois/année
      budget/                   réel vs prévu par catégorie
      comptes/                  solde par compte
      objectifs/                création/suivi/suppression (Server Actions)
      analyses/                 top dépenses, répartition, tableau mensuel
      historique/               revenus/dépenses par année
      parametres/               catégories & comptes (lecture)
  components/
    layout/                    Sidebar, TopBar, Drawer mobile
    dashboard/                 cartes KPI, transactions, IA, objectifs, graphiques, sélecteur de période
  lib/
    supabase/                  clients navigateur / serveur (@supabase/ssr)
    queries.ts                 toutes les lectures Supabase
    compute.ts                 calcul des KPI et agrégats (jamais de valeur en dur)
    insights.ts                calcul des conseils IA (jamais de texte en dur)
  middleware.ts                rafraîchit la session, protège les pages
supabase/schema.sql            tables + policies RLS
public/manifest.json, sw.js    PWA
```

## Prochaines étapes suggérées

- Édition des catégories/comptes dans Paramètres (même patron `actions.ts` que Transactions/Objectifs).
- Remplacer `Patrimoine net` (actuellement = Solde total) par un vrai calcul une fois qu'une table `actifs` existe.
- Les icônes (`icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) sont déjà générées et prêtes pour l'installation Android — à remplacer par un vrai logo si vous en avez un.
- Avant un vrai lancement à plusieurs utilisateurs : réactiver la confirmation email (étape 5 ci-dessus) et revoir `ai-insights-card.tsx`/`insights.ts` avec des seuils que vous jugez pertinents (12 %, 20 %, 85 % sont des choix de départ, pas des constantes figées).
