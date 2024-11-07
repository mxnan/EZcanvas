"use client";
import Authenticate from "@/components/_create/authenticate";
import UserDetails from "@/components/user-data";
import { createClient } from "@/utils/supabase/client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false); // Set loading to false once user check completes
    };
    fetchUser();
  }, [supabase]);

  if (loading) {
    return null; // Optionally, you could show a spinner or loading text here
  }

  if (!user) {
    toast.message("authenticate yourself first ")
    return <Authenticate />;
  }

  return (
    <section className="flex-center min-h-screen">
      <UserDetails />
    </section>
  );
}
