-- Supabase init SQL for sportclub-ace-awapalli
-- Run this in Supabase SQL editor (Project -> SQL Editor -> New Query) and execute.

-- 1) Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id text PRIMARY KEY,
  name text NOT NULL,
  sport text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  prize text NOT NULL,
  entry_fee text,
  paid_free text CHECK (paid_free IN ('paid','free')) NOT NULL,
  registration_status text CHECK (registration_status IN ('open','closed')) NOT NULL,
  image text,
  qr_code_url text,
  created_at timestamptz DEFAULT now()
);

-- For existing projects: add new columns if they're missing
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS entry_fee text;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS qr_code_url text;

-- 2) Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id text PRIMARY KEY,
  match_id text REFERENCES public.matches(id) ON DELETE CASCADE,
  match_name text,
  team_name text NOT NULL,
  captain_name text NOT NULL,
  contact text NOT NULL,
  sport text,
  players jsonb,
  screenshot_url text,
  payment_status text DEFAULT 'pending', -- pending / approved / rejected
  status text DEFAULT 'pending', -- pending / approved / rejected (admin confirmation)
  created_at timestamptz DEFAULT now()
);

-- 3) Development policies (ONLY for development/testing)
-- These policies allow unauthenticated clients to read matches and insert registrations.
-- IMPORTANT: Do NOT use these policies in production. Instead implement Auth and proper policies.

-- If you re-run this file in the SQL editor you may encounter "policy already exists" errors.
-- To make re-runs idempotent we DROP existing policies first.

-- Drop policies if they already exist (safe to run)
DROP POLICY IF EXISTS public_select_matches ON public.matches;
DROP POLICY IF EXISTS public_insert_registrations ON public.registrations;
DROP POLICY IF EXISTS public_update_registrations ON public.registrations;
DROP POLICY IF EXISTS public_select_registrations ON public.registrations;
DROP POLICY IF EXISTS public_delete_registrations ON public.registrations;
DROP POLICY IF EXISTS public_insert_matches ON public.matches;
DROP POLICY IF EXISTS public_update_matches ON public.matches;
DROP POLICY IF EXISTS public_delete_matches ON public.matches;

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT matches
CREATE POLICY "public_select_matches" ON public.matches FOR SELECT USING (true);

-- Allow anyone to INSERT into registrations (so users can register)
CREATE POLICY "public_insert_registrations" ON public.registrations FOR INSERT WITH CHECK (true);

-- Allow admins (for dev allow all) to UPDATE registrations
CREATE POLICY "public_update_registrations" ON public.registrations FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anyone to SELECT registrations (admin page might need this; tighten later)
CREATE POLICY "public_select_registrations" ON public.registrations FOR SELECT USING (true);

-- Allow admins to DELETE registrations (dev: allow all)
CREATE POLICY "public_delete_registrations" ON public.registrations FOR DELETE USING (true);

-- Allow anyone to INSERT matches (dev only)
CREATE POLICY "public_insert_matches" ON public.matches FOR INSERT WITH CHECK (true);
-- Allow anyone to UPDATE matches (dev only)
CREATE POLICY "public_update_matches" ON public.matches FOR UPDATE USING (true) WITH CHECK (true);
-- Allow anyone to DELETE matches (dev only)
CREATE POLICY "public_delete_matches" ON public.matches FOR DELETE USING (true);

-- DEV QUICK FIX: If you want to give full access to admin (or during development),
-- you can disable row level security on these tables. This removes all RLS checks
-- and allows any connected client (with DB credentials) to read/write the tables.
-- WARNING: DO NOT DO THIS IN PRODUCTION.
-- To disable RLS run the two ALTER TABLE statements below (they are commented out by default):

-- ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.registrations DISABLE ROW LEVEL SECURITY;

-- Additionally grant standard table privileges to the public role (optional for some clients):
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO public;

-- Optional: index for faster ordering
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(date);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- 4) Gallery table (optional) - store gallery image metadata. Use Supabase Storage for actual files or store public URLs here.
CREATE TABLE IF NOT EXISTS public.gallery (
  id text PRIMARY KEY,
  url text NOT NULL,
  title text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Make gallery policies idempotent
DROP POLICY IF EXISTS public_select_gallery ON public.gallery;
DROP POLICY IF EXISTS public_insert_gallery ON public.gallery;
DROP POLICY IF EXISTS public_update_gallery ON public.gallery;
DROP POLICY IF EXISTS public_delete_gallery ON public.gallery;

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "public_insert_gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_gallery" ON public.gallery FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_gallery" ON public.gallery FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO public;

-- End of init.sql
