"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { UserMinus } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";

const UserDetails = () => {
  const { profile } = useUserStore();

  return (
    <Link href="/" className="whitespace-nowrap font-bold">
      {profile ? (
        <div className="relative rounded-full overflow-hidden size-10 ring-2 ring-green-600">
          <Image
            src={profile.avatar_url}
            alt="avatar"
            fill
            sizes="(100vw, 100vh)"
            className="object-cover"
          />
        </div>
      ) : (
        <span className="relative rounded-full overflow-hidden size-10">
          <UserMinus />
        </span>
      )}
    </Link>
  );
};

export default UserDetails;
