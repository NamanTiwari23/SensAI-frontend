import { createClient } from '@supabase/supabase-js'

// Supabase configuration with actual credentials
const supabaseUrl = 'https://vabjbpunzhcphtgsmclm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYmpicHVuemhjcGh0Z3NtY2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjcxODgsImV4cCI6MjA2OTA0MzE4OH0.MqM-UCWC1TQ5RKl63Hwc7Qu3w6pNqK7SOqvgwt1hdyc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Your direct PostgreSQL connection string (for reference)
export const postgresConnectionString = 'postgresql://postgres.vabjbpunzhcphtgsmclm:Amarnadh@1234@aws-0-us-east-2.pooler.supabase.com:6543/postgres'

// Instructions:
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings > API
// 4. Copy the "Project URL" and "anon public" key
// 5. Create a .env.local file with:
//    NEXT_PUBLIC_SUPABASE_URL=your_project_url
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key 