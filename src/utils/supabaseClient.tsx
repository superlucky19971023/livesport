import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://crzfnkgmfcvmizhzhpkk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyemZua2dtZmN2bWl6aHpocGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Mzc0NDgsImV4cCI6MjA2MDUxMzQ0OH0.QkZUOc8VS8RcwpVj8BldUxue8ZbaR9bFLaO5L_i2ubM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);