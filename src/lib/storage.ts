import { supabase, supabaseServiceRole } from './supabase';

// Helper to get appropriate client (service role for RLS bypass, or regular client)
const getClient = () => supabaseServiceRole || supabase;

export async function uploadProfileImage(file: File, userId: string) {
  try {
    if (!file || !userId) {
      throw new Error('File and userId are required');
    }

    // Check if file is a valid image
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Convert HEIC/HEIF to a more standard format by converting to data URL
    // For now, we'll just validate the extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !validExtensions.includes(fileExt)) {
      // If it's HEIC/HEIF, we need to convert it
      if (fileExt === 'heic' || fileExt === 'heif') {
        console.warn('HEIC/HEIF format detected. Converting to JPEG...');
        // For HEIC files, we'll convert to JPEG using canvas
        const convertedFile = await convertHeicToJpeg(file);
        return await uploadProfileImage(convertedFile, userId);
      }
      throw new Error('Unsupported file format. Please use JPG, PNG, GIF, or WebP.');
    }

    // Sanitize the userId to create a valid path
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    // Create a unique file name
    const fileName = `${sanitizedUserId}_${Date.now()}.${fileExt}`;

    // Use regular supabase client for storage operations (not service role)
    // Storage operations need different permissions
    const client = getClient();
    
    // First, check if there's an existing profile image to delete
    const { data: userData, error: fetchError } = await client
      .from('user')
      .select('profile_image')
      .eq('auth_user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
    } else if (userData?.profile_image) {
      // Extract the file path from the URL
      const oldFilePath = userData.profile_image.split('/').pop();
      if (oldFilePath) {
        // Try to delete the old file
        await client.storage
          .from('profile-images')
          .remove([oldFilePath]);
      }
    }

    // Upload the new file (use service role client for storage operations)
    const { data, error: uploadError } = await client.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = client.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    // Update the user's profile with the new image URL
    const { error: updateError } = await client
      .from('user')
      .update({ profile_image: publicUrl })
      .eq('auth_user_id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      // If database update fails, try to delete the uploaded file
      await client.storage
        .from('profile-images')
        .remove([fileName]);
      throw updateError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    // Provide helpful error message for missing bucket
    if (error.error === 'Bucket not found' || error.message?.includes('Bucket not found')) {
      throw new Error('Storage bucket "profile-images" not found. Please create it in your Supabase dashboard under Storage > Buckets.');
    }
    throw error;
  }
}

// Helper function to convert HEIC to JPEG
async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // Convert file to data URL
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Create an image from the data URL
    const img = new Image();
    const imgDataUrl = await new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Convert data URL to blob then to file
    const response = await fetch(imgDataUrl);
    const blob = await response.blob();
    const newFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    return newFile;
  } catch (error) {
    console.error('Error converting HEIC file:', error);
    throw new Error('Failed to convert HEIC image. Please convert the image to JPEG or PNG before uploading.');
  }
} 