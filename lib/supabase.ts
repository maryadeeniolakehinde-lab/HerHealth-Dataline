// For backward compatibility, re-export from client
// For server-side operations, use lib/supabase.server.ts
export { createClient, createServiceRoleClient } from './supabase.client';
export { createServerSideClient } from './supabase.server';
