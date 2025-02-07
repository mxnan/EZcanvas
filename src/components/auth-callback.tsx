import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1) // Remove the # character
        );

        // Extract the tokens
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const providerToken = hashParams.get('provider_token');
        // const expiresIn = hashParams.get('expires_in');

        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Set the session with Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          // Store provider token if needed
          if (providerToken) {
            localStorage.setItem('provider_token', providerToken);
          }

          console.log('Authentication successful');
          navigate('/', { replace: true }); // Use replace to prevent back navigation
        } else {
          throw new Error('Failed to establish session');
        }

      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/', { replace: true });
      }
    };

    // Execute the auth handling
    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p>Please wait while we complete the sign-in process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;