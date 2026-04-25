import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env.local file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for database tables
export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  github_url: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  file_url: string | null;
  file_type: string | null;
  description: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Status {
  id: string;
  label: string;
  emoji: string | null;
  color: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: string;
  key: string;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

// Database type helper
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'id' | 'created_at'>;
        Update: Partial<Omit<Certificate, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>;
      };
      status: {
        Row: Status;
        Insert: Omit<Status, 'id' | 'updated_at'>;
        Update: Partial<Omit<Status, 'id'>>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>;
        Update: Partial<Omit<SiteSetting, 'id'>>;
      };
      features: {
        Row: Feature;
        Insert: Omit<Feature, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Feature, 'id' | 'created_at'>>;
      };
      stats: {
        Row: Stat;
        Insert: Omit<Stat, 'id' | 'updated_at'>;
        Update: Partial<Omit<Stat, 'id'>>;
      };
    };
  };
};
