import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      divinations: {
        Row: {
          id: string;
          user_id: string;
          hexagram_number: number;
          hexagram_name: string;
          hexagram_binary: string;
          interpretation: string;
          question: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hexagram_number: number;
          hexagram_name: string;
          hexagram_binary: string;
          interpretation: string;
          question?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hexagram_number?: number;
          hexagram_name?: string;
          hexagram_binary?: string;
          interpretation?: string;
          question?: string | null;
          created_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};