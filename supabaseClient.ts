import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and API key
const supabaseUrl = "https://knfjpduuwvynpewocprv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZmpwZHV1d3Z5bnBld29jcHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NDk3NzgsImV4cCI6MjAzODQyNTc3OH0.9sI-U8e-R2xRyGR-D9EONiUaW-D7quF0p9MJiFGoAy8";
export const supabase = createClient(supabaseUrl, supabaseKey);
