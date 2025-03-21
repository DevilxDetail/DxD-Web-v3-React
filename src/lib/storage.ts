import { supabase } from './supabase';

export async function uploadProfileImage(file: File, userId: string) {
  try {
    if (!file || !userId) {
      throw new Error('File and userId are required');
    }

    // Sanitize the userId to create a valid path
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${sanitizedUserId}_${Date.now()}.${fileExt}`;

    // First, check if there's an existing profile image to delete
    const { data: userData, error: fetchError } = await supabase
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
        await supabase.storage
          .from('profile-images')
          .remove([oldFilePath]);
      }
    }

    // Upload the new file
    const { data, error: uploadError } = await supabase.storage
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
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    // Update the user's profile with the new image URL
    const { error: updateError } = await supabase
      .from('user')
      .update({ profile_image: publicUrl })
      .eq('auth_user_id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      // If database update fails, try to delete the uploaded file
      await supabase.storage
        .from('profile-images')
        .remove([fileName]);
      throw updateError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
} 