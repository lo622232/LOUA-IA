import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Entrepreneur = {
  id: string;
  email: string;
  full_name: string;
  business_name: string | null;
  business_sector: string | null;
  business_description: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessAnalysis = {
  id: string;
  entrepreneur_id: string;
  analysis_type: string;
  business_data: Record<string, any>;
  analysis_result: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
};

export type AIConversation = {
  id: string;
  entrepreneur_id: string;
  message: string;
  is_ai_response: boolean;
  created_at: string;
};
