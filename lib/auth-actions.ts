"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },

      redirectTo: `${process.env.NEXT_PUBLIC_URL + "/create"}`,
    },
  });

  if (error) {
    toast.error(error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(data.url);
}
