import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { supabase } from '../../supabaseClient'; // Adjust the import based on your project structure

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (data.session) {
        // Successfully authenticated, redirect to the main application page
        navigate('/'); // Redirect to your main page or dashboard
      } else {
        console.error('No session found');
        navigate('/login'); // Redirect to login or an appropriate page
      }
    };

    handleAuth();
  }, [navigate]);

  return <div>Loading...</div>; // Show a loading state while processing
};

export default AuthCallback;