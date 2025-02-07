import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!session) {
          console.error('No session found');
          navigate('/');
          return;
        }

        // Successfully authenticated
        navigate('/');
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/');
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