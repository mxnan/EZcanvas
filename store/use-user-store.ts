import { create } from 'zustand';
import { createProfileSlice, type ProfileSlice } from './slices/profile-slice';
import { createGenerationsSlice, type GenerationsSlice } from "./slices/gen-slice";

export const useUserStore = create<ProfileSlice & GenerationsSlice>()((...args) => ({
  ...createProfileSlice(...args),
  ...createGenerationsSlice(...args),
}));