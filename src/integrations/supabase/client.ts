// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uoduhxynoylykyisvphs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZHVoeHlub3lseWt5aXN2cGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDUxMzksImV4cCI6MjA2Mzk4MTEzOX0.HCUVht9zYoqyQPHOhrmIQMptsWvRtJOQItpBFkVvreU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);