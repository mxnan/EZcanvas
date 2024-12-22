"use server";

import { createClient } from "@/utils/supabase/server";

export async function signout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Sign out error:", error);

    return false;
  }
}

export async function signInWithGoogle(): Promise<{ url: string } | null> {
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV! === "prod";
  const redirectTo = isProduction
    ? process.env.NEXT_PUBLIC_BUILD_ENV! // Production URL
    : process.env.NEXT_PUBLIC_DEV_ENV!; // Development URL
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // queryParams: {
        //   access_type: "offline",
        //   prompt: "consent",
        // },
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("Auth error:", error);
      return null;
    }

    return { url: data.url };
  } catch (error) {
    console.error("Sign in error:", error);
    return null;
  }
}
