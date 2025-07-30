import { supabase } from './supabase';

// Add a test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('user').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

export interface PrivyUser {
  id: string;
  wallet?: {
    address: string;
  };
  email?: string;
  name?: string;
}

export async function createOrUpdateSupabaseUser(privyUser: PrivyUser) {
  // Test connection first
  await testSupabaseConnection();
  
  if (!privyUser.id) {
    throw new Error('User ID is required');
  }

  if (!privyUser.wallet?.address) {
    throw new Error('Wallet address is required');
  }

  try {
    console.log('Checking for existing user with auth_user_id:', privyUser.id);
    
    // Modified query to handle 406 error
    const { data: existingUser, error: fetchError } = await supabase
      .from('user')
      .select('user_id, auth_user_id, evm_wallet, email, name')
      .eq('auth_user_id', privyUser.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.log('Fetch error details:', fetchError);
      throw fetchError;
    }

    const userData = {
      auth_user_id: privyUser.id,
      evm_wallet: privyUser.wallet.address,
      email: privyUser.email,
      name: privyUser.name,
    };

    console.log('Preparing to save user data:', userData);

    if (!existingUser) {
      console.log('Creating new user...');
      const { data, error } = await supabase
        .from('user')
        .insert([{
          ...userData,
          profile_image: '/default profile.png', // Set default profile image for new users
          created_at: new Date().toISOString(),
        }])
        .select('user_id, auth_user_id, evm_wallet, email, name')
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('Successfully created user:', data);
      return data;
    } else {
      console.log('Updating existing user...');
      const { data, error } = await supabase
        .from('user')
        .update(userData)
        .eq('auth_user_id', privyUser.id)
        .select('user_id, auth_user_id, evm_wallet, email, name')
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Successfully updated user:', data);
      return data;
    }
  } catch (error) {
    console.error('Detailed error in createOrUpdateSupabaseUser:', {
      error,
      message: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }
} 