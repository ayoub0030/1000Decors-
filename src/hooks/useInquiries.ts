import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert'];
export type InquiryUpdate = Database['public']['Tables']['inquiries']['Update'];

// Fetch all inquiries (admin only)
export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*, products(name, slug)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching inquiries: ${error.message}`);
      }
      
      return data as (Inquiry & { products: { name: string; slug: string } | null })[];
    },
  });
};

// Create a new inquiry
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inquiry: InquiryInsert) => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert(inquiry)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating inquiry: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

// Update an inquiry (change status)
export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error updating inquiry: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

// Delete an inquiry
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting inquiry: ${error.message}`);
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};
