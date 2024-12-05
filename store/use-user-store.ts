import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import type { Profile } from "@/types/database";

interface UserStore {
  profile: Profile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  decrementGenerations: () => Promise<boolean>;
  checkCanGenerate: () => boolean;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  isLoading: true,

  fetchProfile: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

  decrementGenerations: async () => {
    const supabase = createClient();
    const profile = get().profile;

    if (!profile) return false;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        free_generations_left: Math.max(0, profile.free_generations_left - 1),
        total_generations: profile.total_generations + 1,
        last_generation_time: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) return false;
    set({ profile: data });
    return true;
  },

  checkCanGenerate: () => {
    const profile = get().profile;
    if (!profile) return false;
    return profile.lifetime_subscription || profile.free_generations_left > 0;
  },

  reset: () => {
    set({ profile: null, isLoading: false });
  },
}));
