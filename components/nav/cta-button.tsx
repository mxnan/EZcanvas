"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import Link from "next/link";
import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { usePathname } from "next/navigation";

const CTAButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const pathname = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {user ? (
        <Button
          size={"icon"}
          variant={"destructive"}
          className="text-sm font-bold "
          onClick={() => {
            
            signout();
            setUser(null);
          }}
        >
          <ArrowDownLeft />
        </Button>
      ) : (
        <Link href="/create">
          <Button
            className="text-sm font-bold"
            size={"icon"}
            variant={"default"}
          >
            <ArrowDownRight />
          </Button>
        </Link>
      )}
    </>
  );
};

export default CTAButton;
