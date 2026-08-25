import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET_NAME = 'logistics-documents';

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: string;
  error?: string;
}

export const storageService = {
  // 1. Upload de Nota Fiscal (PDF ou XML)
  async uploadInvoice(file: File, requestId: string): Promise<UploadResult> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const cleanFileName = `nfe_${Date.now()}.${fileExt}`;
    const filePath = `invoices/${requestId}/${cleanFileName}`;
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

          return {
            url: publicUrlData.publicUrl,
            fileName: file.name,
            fileSize: fileSizeFormatted
          };
        }
      } catch (err: any) {
        console.warn('Storage Supabase uploadInvoice fallback:', err.message);
      }
    }

    // Fallback local caso o bucket ainda não tenha sido criado
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      fileName: file.name,
      fileSize: fileSizeFormatted
    };
  },

  // 2. Upload de Foto do Canhoto de Entrega / Comprovante Mercado Full
  async uploadDeliveryProof(file: File, requestId: string): Promise<UploadResult> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `canhoto_${Date.now()}.${fileExt}`;
    const filePath = `proofs/${requestId}/${cleanFileName}`;
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

          return {
            url: publicUrlData.publicUrl,
            fileName: file.name,
            fileSize: fileSizeFormatted
          };
        }
      } catch (err: any) {
        console.warn('Storage Supabase uploadDeliveryProof fallback:', err.message);
      }
    }

    // Fallback local
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      fileName: file.name,
      fileSize: fileSizeFormatted
    };
  }
};
