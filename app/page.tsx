import LoginButton from "@/components/log-inout-button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import UserGreetText from "@/components/user-data";

export default function Home() {
  return (
    <div className="w-full space-y-6 min-h-screen flex flex-col items-center justify-center">
      <Button>Click me</Button>
      <ThemeToggle />
      <UserGreetText />
      <LoginButton />
    </div>
  );
}
