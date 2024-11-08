"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import Link from "next/link";

const CTAButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user ? (
        <Button
          size={"sm"}
          variant={"default"}
          className="text-sm font-bold "
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
      ) : (
        <Link href="/create">
          <Button className="text-sm font-bold" size={"sm"} variant={"default"}>
            Start Now
          </Button>
        </Link>
      )}
    </>
  );
};

export default CTAButton;
