"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";

const LoginButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
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
  // if (user) {
  //   return (
  //     <Button
  //       onClick={() => {
  //         signout();
  //         setUser(null);
  //       }}
  //     >
  //       Log out
  //     </Button>
  //   );
  // }
  return (
    <>
      {user ? (
        <Button
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
      ) : (
        <Button
          onClick={() => {
            router.push("/create");
          }}
        >
          Log in
        </Button>
      )}
    </>
  );
};

export default LoginButton;
