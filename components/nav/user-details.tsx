"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserMinus } from "lucide-react";

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
      <Link href="/" className="font-mono whitespace-nowrap font-bold">
        {user ? (
          <div className="relative rounded-full overflow-hidden size-10 ring-2 ring-green-600">
            <Image
              src={user.user_metadata.avatar_url}
              alt="avatar"
              fill
              priority
              sizes="(100vw, 100vh)"
              className="object-cover"
            />
          </div>
        ) : (
          <>
            <span className="relative rounded-full overflow-hidden size-10 ">
              <UserMinus />
            </span>
          </>
        )}
      </Link>
    </>
  );
};

export default UserDetails;
