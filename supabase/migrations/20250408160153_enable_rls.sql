-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.members enable row level security;

-- Create policy to allow users to view other users in their organization
create policy "users_in_same_org" on public.users
    for select using (
        exists (
            select 1 from public.members
            where members.user_id = users.id
            and members.organization_id = (auth.jwt()->>'org_id')::text
        )
    );

-- Create policy to allow users to view their own organization
create policy "view_own_organization" on public.organizations
    for select using (
        id = (auth.jwt()->>'org_id')::text
    );

-- Create policy to view members in current organization
create policy "members_in_current_org" on public.members
    for select using (
        organization_id = (auth.jwt()->>'org_id')::text
    );

-- Allow the service role to bypass RLS for webhook operations
alter table public.users force row level security;
alter table public.organizations force row level security;
alter table public.members force row level security;
