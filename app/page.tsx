
import LoginButton from "@/components/log-inout-button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import UserGreetText from "@/components/user-data";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full space-y-6 min-h-screen flex-center flex-col">
      <ThemeToggle />
      <UserGreetText />
      <LoginButton />
      <Link href="/create">
        <Button>Click me</Button>
      </Link>
    </div>
  );
}
