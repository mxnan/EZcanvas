import type { StateCreator } from 'zustand';
import type { ProfileSlice } from './profile-slice';
import { createClient } from '@/utils/supabase/client';

export interface GenerationsSlice {
  decrementGenerations: () => Promise<boolean>;
  checkCanGenerate: () => boolean;
}

export const createGenerationsSlice: StateCreator<
  ProfileSlice & GenerationsSlice,
  [],
  [],
  GenerationsSlice
> = (set, get) => ({
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
    return !!profile && (profile.lifetime_subscription || profile.free_generations_left > 0);
  },
});