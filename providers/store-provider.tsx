"use client";

import { useUserStore } from "@/store/use-user-store";
import { useEffect } from "react";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const fetchProfile = useUserStore(state => state.fetchProfile);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  return <>{children}</>;
}