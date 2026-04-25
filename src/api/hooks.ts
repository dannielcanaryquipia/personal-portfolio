// Suppress Supabase console warnings that expose project reference
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args.join(' ');
  if (message.includes('GoTrueClient') && message.includes('Multiple')) {
    return; // Suppress GoTrueClient instance warnings
  }
  originalWarn.apply(console, args);
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Project, Certificate, ContactMessage, Status, SiteSetting, Feature, Stat } from './supabase';

// ============================================
// PROJECTS
// ============================================

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// ============================================
// CERTIFICATES
// ============================================

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<Certificate[]> => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificate: Omit<Certificate, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([certificate])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Certificate> & { id: string }) => {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

// ============================================
// CONTACT MESSAGES
// ============================================

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contact_messages'],
    queryFn: async (): Promise<ContactMessage[]> => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) => {
      // Create a fresh client without auth session to ensure anon role is used
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase credentials');
      }

      // Use fresh client with memory storage to completely isolate from existing sessions
      const memoryStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };

      const publicClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          storage: memoryStorage,
        },
      });

      const { data, error } = await publicClient
        .from('contact_messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    },
  });
};

// ============================================
// STATUS
// ============================================

export const useStatus = () => {
  return useQuery({
    queryKey: ['status'],
    queryFn: async (): Promise<Status | null> => {
      const { data, error } = await supabase
        .from('status')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data || null;
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Status>) => {
      // Get active status id
      const { data: current } = await supabase
        .from('status')
        .select('id')
        .eq('is_active', true)
        .single();
      
      if (current) {
        const { data, error } = await supabase
          .from('status')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', current.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new if none exists
        const { data, error } = await supabase
          .from('status')
          .insert([{ ...updates, is_active: true }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status'] });
    },
  });
};

// ============================================
// SITE SETTINGS
// ============================================

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async (): Promise<SiteSetting[]> => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
    },
  });
};

// ============================================
// FILE UPLOAD
// ============================================

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({ bucket, file }: { bucket: string; file: File }) => {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('User is not authenticated!');
        throw new Error('User is not authenticated. Please log in to upload files.');
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          name: uploadError.name,
        });
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { publicUrl, filePath };
    },
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: async ({ bucket, filePath }: { bucket: string; filePath: string }) => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    },
  });
};

// ============================================
// FEATURES
// ============================================

export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: async (): Promise<Feature[]> => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllFeatures = () => {
  return useQuery({
    queryKey: ['features', 'all'],
    queryFn: async (): Promise<Feature[]> => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feature: Omit<Feature, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('features')
        .insert(feature)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
};

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...feature }: Partial<Feature> & { id: string }) => {
      const { data, error } = await supabase
        .from('features')
        .update(feature)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
};

export const useDeleteFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('features').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
};

// ============================================
// STATS
// ============================================

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stat[]> => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAllStats = () => {
  return useQuery({
    queryKey: ['stats', 'all'],
    queryFn: async (): Promise<Stat[]> => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, ...updates }: Partial<Stat> & { key: string }) => {
      const { data, error } = await supabase
        .from('stats')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useDeleteStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase.from('stats').delete().eq('key', key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};
