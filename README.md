# RESOLV360

A warranty claim management web app. Consumers file warranty claims against the companies that made their products, and companies review those claims and move them through to resolution.

Built with React 19, Vite, Tailwind CSS v4 and Supabase (auth + Postgres). Deployed on Vercel.

## Features

**Consumers**
- File a warranty claim against a registered company (product name, serial number, purchase date, warranty expiry date, issue details)
- Track claims on a dashboard with counts for submitted, received and resolved claims
- The dashboard reloads when you come back to the tab, so status changes made by the company show up

**Companies**
- See every claim filed against the company, with the customer's name and email
- Change a claim's status: `submitted` → `received` → `resolved`

**Authentication**
- Email and password sign-up and login
- Passwordless login with a 6-digit email code (OTP)
- Sign in with Google
- Users who sign in with OTP or Google for the first time pick an account type (consumer or company) on the Complete Profile page
- Route guards send each user to the right dashboard and keep consumers and companies out of each other's pages

## Tech stack

| Area | Tool |
| --- | --- |
| UI | React 19, React Router 8 |
| Styling | Tailwind CSS 4 |
| Build | Vite 8 |
| Backend | Supabase (Auth, Postgres, Row Level Security) |
| Hosting | Vercel |

## Project structure

```
my-app/
├── index.html
├── vercel.json              # SPA rewrite: every path serves index.html
├── vite.config.js
└── src/
    ├── App.jsx              # Routes
    ├── main.jsx             # Entry point, wraps the app in AuthProvider
    ├── components/
    │   ├── GoogleButton.jsx
    │   ├── ProtectedRoute.jsx   # Requires login + profile + matching user type
    │   └── PublicRoute.jsx      # Redirects logged-in users to their dashboard
    ├── context/
    │   └── AuthContext.jsx      # Session and profile state
    ├── lib/
    │   └── supabaseClient.js
    ├── pages/
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── CompleteProfile.jsx
    │   ├── ConsumerDashboard.jsx
    │   ├── CompanyDashboard.jsx
    │   └── ClaimForm.jsx
    └── services/
        └── authService.js       # All Supabase calls (auth, profiles, claims)
```

## Routes

| Path | Access | Page |
| --- | --- | --- |
| `/login` | Logged out | Login (password, email code, Google) |
| `/signup` | Logged out | Sign up as a consumer or company |
| `/complete-profile` | Logged in, no profile yet | Choose account type and fill in details |
| `/consumer/dashboard` | Consumers | Claims overview |
| `/ClaimForm` | Consumers | File a new claim |
| `/company/dashboard` | Companies | Review and update claims |
| any other path | — | Redirects to the dashboard, or to `/login` if logged out |

## Getting started

### Prerequisites

- Node.js 20.19+ (required by Vite 8)
- A Supabase project

### 1. Install

```bash
git clone https://github.com/Tarun-Uppal/TSEC-SEM3-FSJ-PROJECT.git
cd TSEC-SEM3-FSJ-PROJECT/my-app
npm install
```

### 2. Environment variables

Create `my-app/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Both values are under **Project Settings → API** in the Supabase dashboard. `.env` is git-ignored.

### 3. Set up Supabase

#### Database tables

The app expects these tables in the `public` schema:

| Table | Columns |
| --- | --- |
| `profiles` | `id` (uuid, PK, references `auth.users.id`), `full_name`, `email`, `user_type` (`consumer` or `company`) |
| `consumers` | `user_id` (uuid, references `profiles.id`), `phone`, `address` |
| `companies` | `user_id` (uuid, PK, references `profiles.id`), `company_name`, `contact_name`, `phone`, `address` |
| `warranty_claims` | `id`, `claim_number`, `user_id` (references `profiles.id`), `company_id` (references `companies.user_id`), `product_name`, `serial_number`, `purchase_date`, `expiry_date`, `issue_details`, `status` (`submitted`, `received`, `resolved`), `created_at` |

The foreign keys matter: claim queries join `warranty_claims` to `companies` (for the company name) and to `profiles` through `user_id` (for the customer's name and email).

#### Row Level Security

Enable RLS on every table and add policies so that:

- users can insert and read their own `profiles`, `consumers` and `companies` rows
- any logged-in user can read `companies` (consumers pick a company when filing a claim)
- consumers can insert claims and read claims where `user_id = auth.uid()`
- companies can read and update claims where `company_id = auth.uid()`
- companies can read the `profiles` rows of customers who filed claims against them

If a status update silently does nothing, the company's update policy on `warranty_claims` is usually the cause.

#### Authentication

In **Authentication → Providers**:

- **Email**: enabled. "Confirm email" can be on or off; the app handles both.
- **Google**: enabled, with a Google Cloud OAuth client ID and secret.

In **Authentication → URL Configuration**, set the Site URL to your deployed URL and add `http://localhost:5173/**` and your production URL to the redirect URLs.

For email code login, the **Magic Link** email template must include `{{ .Token }}` so the 6-digit code appears in the email.

### 4. Run

```bash
npm run dev
```

The app runs at http://localhost:5173.

## Scripts

Run from `my-app/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## How sign-up works

Sign-up does not write profile rows directly. The details entered on the sign-up form are stored in the Supabase auth user's metadata. On first login, the Complete Profile page creates the `profiles` row and the matching `consumers` or `companies` row. OTP and Google sign-ins use the same page, so there is one path for creating profiles however the user signed up.

## Deployment

The app is set up for Vercel:

1. Import the repository and set the **Root Directory** to `my-app`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables.
3. Deploy. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh.
4. Add the production URL to Supabase's Site URL and redirect URLs.

## Course

Semester 3 FSJ project, TSEC.
