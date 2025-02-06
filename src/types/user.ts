export interface UserType {
  id: string;
  email: string;
  isPremium: boolean;
  avatar_url?: string;
}

export interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}