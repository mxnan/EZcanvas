import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full space-y-6 min-h-screen flex flex-col items-center justify-center">
      <Button>Click me</Button>
      <ThemeToggle />
      <p className="text-2xl">Landing</p>
    </div>
  );
}
