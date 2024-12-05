import { useUserStore } from "@/store/use-user-store";
import React from "react";
import { Button } from "../ui/button";

export default function GenCount() {
  const { profile } = useUserStore();

  if (!profile || profile.lifetime_subscription) return null;
  return (
    <>
      <p> {profile.free_generations_left} gens left !!</p>

      <Button variant={"destructive"}>Upgrade ?</Button>
    </>
  );
}
