import { useUserStore } from "@/store/use-user-store";
import { Button } from "../ui/button";
import { useState } from "react";
import PayDialog from "./dialog/pay-dialog";
import { CheckCheck } from "lucide-react";

export default function GenCount() {
  const { profile } = useUserStore();
  const [showPayDialog, setShowPayDialog] = useState(false);

  if (!profile || profile.lifetime_subscription)
    return (
      <>
        <p className="text-sm text-orange-700 dark:text-yellow-500 font-medium"><CheckCheck /></p>
      </>
    );

  return (
    <>
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">
          BETA version, {profile.free_generations_left} generations left
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowPayDialog(true)}
        >
          Upgrade
        </Button>
      </div>

      <PayDialog
        isOpen={showPayDialog}
        onClose={() => setShowPayDialog(false)}
      />
    </>
  );
}
