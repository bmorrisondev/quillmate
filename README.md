# Quillmate

A collaborative writing platform built with Next.js, Supabase, and Clerk.

## Prerequisites

- Node.js (v18 or higher)
- pnpm or npm
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)
- Git

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/bmorrisondev/quillmate.git
cd quillmate
```

2. Install dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install
```

3. Set up Clerk
- Create a new account at [Clerk](https://clerk.dev)
- Create a new application
- Copy the keys from Step 2 of the quickstart
- Add to your `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

4. Set up Supabase
- Create a new account at [Supabase](https://supabase.com)
- Create a new project. Take note of the database password as you'll need it later.
- Go to Project Settings > API
- Copy the `Project URL` and `anon` key
- Create a `.env.local` file in the root directory and add:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. Integrate Clerk with Supabase
- In the Supabase dashboard, go to Project Settings > Authentication > Sign Up/In > Third party auth
- Add Clerk as a provider
- Click the "Clerk's Connect Supabase page" URL to open the setup page in Clerk
- Select your Organization, Application, and Instance
- Click "Activate Supabase integration"
- Copy the Clerk domain value from the page and paste it in the Supabase dashboard.
- Click Create connection.

6. Link your project to Supabase
- Run the following command and select the project you created in Step 2.
```bash
supabase link
```

7. Apply database migrations
- Run the following command and provide your database password when prompted.
```bash
# Using pnpm
pnpm supabase db push

# Using npx
npx supabase db push
```

8. Start the development server
```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Features

- Collaborative writing environment
- Real-time updates
- Organization support through Clerk
- Secure authentication and authorization
- Responsive design

## Tech Stack

- Next.js 15 (App Router)
- Supabase (Database & RLS)
- Clerk (Authentication)
- TypeScript
- Tailwind CSS
