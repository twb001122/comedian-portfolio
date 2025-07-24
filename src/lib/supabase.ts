import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少Supabase环境变量。请检查.env文件。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);