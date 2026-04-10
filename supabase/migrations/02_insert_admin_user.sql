-- Insert default admin user
INSERT INTO public.admin_users (email, password_hash, role, is_active)
VALUES (
  'herhealthdataline@gmail.com',
  '',  -- Empty password hash until admin sets password on first login
  'admin',
  TRUE
) ON CONFLICT (email) DO NOTHING;
