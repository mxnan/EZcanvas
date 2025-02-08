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

        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Set the session with Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          throw error;
        }

        // Successfully authenticated
        console.log('Authentication successful');
        navigate('/', { replace: true }); // Redirect to home

      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/', { replace: true }); // Redirect to home on error
      }
    };

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