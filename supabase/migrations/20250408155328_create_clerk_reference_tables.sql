-- Create users table
create table if not exists public.users (
    id text primary key,
    first_name text,
    last_name text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create organizations table
create table if not exists public.organizations (
    id text primary key,
    name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create members table (organization memberships)
create table if not exists public.members (
    id text primary key,
    user_id text not null references public.users(id) on delete cascade,
    organization_id text not null references public.organizations(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    -- Ensure a user can only be a member of an organization once
    constraint unique_user_org unique (user_id, organization_id)
);

-- Create indexes for better query performance
create index if not exists idx_members_user_id on public.members(user_id);
create index if not exists idx_members_organization_id on public.members(organization_id);
