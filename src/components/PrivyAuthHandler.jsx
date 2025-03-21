import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { createOrUpdateSupabaseUser } from '../lib/auth';

export function PrivyAuthHandler() {
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    const handleAuth = async () => {
      if (ready && authenticated && user) {
        console.log('PrivyAuthHandler: User authenticated');
        console.log('User data:', {
          id: user.id,
          hasWallet: !!user.wallet,
          walletAddress: user.wallet?.address,
          email: user.email?.address,
          name: user.name
        });

        try {
          const result = await createOrUpdateSupabaseUser({
            id: user.id,
            wallet: user.wallet,
            email: user.email?.address,
            name: user.name
          });
          console.log('Supabase user created/updated:', result);
        } catch (error) {
          console.error('Failed to sync user with Supabase:', error);
        }
      }
    };

    handleAuth();
  }, [ready, authenticated, user]);

  return null; // This component doesn't render anything
} 