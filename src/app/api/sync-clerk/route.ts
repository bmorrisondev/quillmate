import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth()
    // Only I can execute this
    if(userId !== 'user_2s2XJgQ2iQDUAsTBpem9QTu8Zf7') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clerk = await clerkClient();
    const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const users = await clerk.users.getUserList();
    for (const user of users.data) {
      await supabase.from('users').upsert({
        id: user.id,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        avatar_url: user.imageUrl || null,
        created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        updated_at: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
      });
    }

    const orgs = await clerk.organizations.getOrganizationList();
    for (const org of orgs.data) {
      await supabase.from('organizations').upsert({
        id: org.id,
        name: org.name,
        created_at: org.createdAt ? new Date(org.createdAt).toISOString() : new Date().toISOString(),
        updated_at: org.updatedAt ? new Date(org.updatedAt).toISOString() : new Date().toISOString(),
      });
    }

    let totalMemberships = 0;
    for (const org of orgs.data) {
      const memberships = await clerk.organizations.getOrganizationMembershipList({ organizationId: org.id });
      for (const membership of memberships.data) {
        await supabase.from('members').upsert({
          id: membership.id,
          user_id: membership.publicUserData?.userId,
          organization_id: org.id,
          created_at: membership.createdAt ? new Date(membership.createdAt).toISOString() : new Date().toISOString(),
          updated_at: membership.updatedAt ? new Date(membership.updatedAt).toISOString() : new Date().toISOString(),
        });
        totalMemberships++;
      }
    }

    return NextResponse.json({
      message: 'Clerk to Supabase sync complete.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
  }
}
