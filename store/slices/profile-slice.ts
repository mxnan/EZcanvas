import type { StateCreator } from 'zustand';
import type { Profile } from '@/types/database';
import { createClient } from '@/utils/supabase/client';

export interface ProfileSlice {
  profile: Profile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  reset: () => void;
}

export const createProfileSlice: StateCreator<
  ProfileSlice,
  [],
  [],
  ProfileSlice
> = (set) => ({
  profile: null,
  isLoading: true,

  fetchProfile: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      set({ profile: null, isLoading: false });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    set({ profile, isLoading: false });
  },

  reset: () => set({ profile: null, isLoading: false }),
});