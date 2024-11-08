"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const UserDetails = () => {
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
        <div className="flex items-center gap-3">
          <p className="font-mono font-bold">
            {user.user_metadata.full_name ?? "user"}!
          </p>
          <div className="relative rounded-full overflow-hidden size-8 ">
            <Image src={user.user_metadata.avatar_url} alt="avatar" fill sizes="(100vw, 100vh)" className="object-cover" />
          </div>
        </div>
      ) : (
        <>
          <p className="font-mono font-extrabold uppercase text-lg">image-text-gif</p>
        </>
      )}
    </>
  );
};

export default UserDetails;