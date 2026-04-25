/**
 * Test upload utility for debugging storage issues
 * Run this from browser console to test file upload independently
 */

import { supabase } from '@/api/supabase';

export async function testUpload(file: File) {
  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    // Check bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'certificates');
    if (!bucketExists) {
      throw new Error('Bucket "certificates" does not exist');
    }

    // Attempt upload
    const fileName = `test-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('certificates')
      .upload(fileName, file);

    if (error) {
      console.error('Upload failed:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName);

    return { success: true, publicUrl, fileName };
  } catch (error) {
    console.error('Test upload failed:', error);
    return { success: false, error };
  }
}

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).testUpload = testUpload;
}

/**
 * Usage from browser console:
 * 1. Create a file input in console:
 *    const input = document.createElement('input');
 *    input.type = 'file';
 *    input.onchange = (e) => testUpload(e.target.files[0]);
 *    input.click();
 * 
 * 2. Or call with an existing file:
 *    testUpload(fileObject)
 */
