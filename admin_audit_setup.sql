-- ============================================================
-- DEER Drone - Admin Audit Logging System
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email text NOT NULL,
    action text NOT NULL, -- e.g., 'UPDATE_ORDER_STATUS', 'UPLOAD_VIDEO', 'DELETE_PRODUCT'
    target_table text,
    target_id text,
    details jsonb, -- Detailed changes or metadata
    ip_address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Only Authenticated users can view logs for now
-- (We verify Admin status at the Application/API level)
CREATE POLICY "authenticated_access" ON admin_audit_logs
FOR ALL USING (auth.role() = 'authenticated');

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON admin_audit_logs (created_at DESC);

COMMENT ON TABLE admin_audit_logs IS 'Tracks all administrative actions performed via the admin panel.';
