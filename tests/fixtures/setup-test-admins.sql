-- Setup Test Admin Users for E2E Tests
-- Execute this in Supabase SQL Editor BEFORE running E2E tests

-- Step 1: Check if test users exist in auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email IN (
  'admin@ideaonaction.local',
  'superadmin@ideaonaction.local'
)
ORDER BY email;

-- Step 2: Insert test users into admins table (if they don't exist)
-- Note: Replace the UUIDs below with actual user IDs from Step 1

-- For admin@ideaonaction.local (role: admin)
INSERT INTO public.admins (user_id, role)
SELECT id, 'admin'::text
FROM auth.users
WHERE email = 'admin@ideaonaction.local'
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';

-- For superadmin@ideaonaction.local (role: super_admin)
INSERT INTO public.admins (user_id, role)
SELECT id, 'super_admin'::text
FROM auth.users
WHERE email = 'superadmin@ideaonaction.local'
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin';

-- Step 3: Verify admin users were created
SELECT
  a.id,
  a.user_id,
  a.role,
  u.email,
  a.created_at
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id
WHERE u.email IN (
  'admin@ideaonaction.local',
  'superadmin@ideaonaction.local'
)
ORDER BY u.email;

-- Expected Result:
-- admin@ideaonaction.local     | admin
-- superadmin@ideaonaction.local | super_admin

-- Step 4 (Optional): If test users don't exist in auth.users, create them first
-- Note: This should be done via Supabase Dashboard "Authentication" > "Users" > "Add user"
-- Or use supabase CLI:
-- supabase auth users create admin@ideaonaction.local --password demian00
-- supabase auth users create superadmin@ideaonaction.local --password SuperAdmin123!
