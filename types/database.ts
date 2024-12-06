export interface Profile {
  id: string;
  email: string;
  avatar_url: string;
  lifetime_subscription: boolean;
  free_generations_left: number;
  total_generations: number;
  last_generation_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: Profile | null;
  isLoading: boolean;
}
