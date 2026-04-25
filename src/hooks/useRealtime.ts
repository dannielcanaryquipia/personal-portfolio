import { useEffect } from 'react';
import { supabase } from '@/api/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeStatus = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('status-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'status' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['status'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

export const useRealtimeProjects = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

export const useRealtimeCertificates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('certificates-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['certificates'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
