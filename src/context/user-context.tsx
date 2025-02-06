import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { AuthContextType, UserType } from "@/types/user";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession(); // Await the result

      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }

      const session = data.session; // Access the session from the resolved data

      if (session?.user) {
        const userData: UserType = {
          id: session.user.id,
          email: session.user.email || "",
          isPremium: false, // Default value
          avatar_url: session.user.user_metadata?.avatar_url || "", // Default to empty string
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUserProfile(session.user.id);
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
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          redirectTo: `${(import.meta as any).env.VITE_REDIRECT_URL}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
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
