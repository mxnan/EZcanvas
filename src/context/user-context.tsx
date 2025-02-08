import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { AuthContextType, UserType } from "@/types/user";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setLoading(false);
          return;
        }

        if (data?.session?.user) {
          await getUserProfile(data.session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth state changed:", event);
      
      if (session?.user) {
        await getUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          isPremium: data.is_premium,
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error in getUserProfile:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = import.meta.env.VITE_DEV_MODE === "dev"
        ? `${import.meta.env.VITE_DEV_URL}/auth/callback`
        : `${import.meta.env.VITE_PROD_URL}/auth/callback`;

      console.log("Redirecting to:", redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error("Error during sign out:", error);
      }
      // Clear the user state regardless of the result
      setUser(null);
      // Force reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
      setUser(null);
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
