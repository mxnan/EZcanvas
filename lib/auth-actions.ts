"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export async function signout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Failed to sign out");
    return false;
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/create`,
      },
    });

    if (error) throw error;
    
    revalidatePath("/", "layout");
    redirect(data.url);
  } catch (error) {
    console.error('Sign in error:', error);
    redirect("/error?message=authentication-failed");
  }
}