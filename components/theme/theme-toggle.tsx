"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    // toast.success(`Switched to : ${theme === "dark" ? "light" : "dark"}`);
  };

  if (!mounted) return null; // Prevent rendering on the server

  return (
    <Button
      variant="default"
      size={"icon"}
      aria-label="Toggle Dark Mode"
      type="button"
      className=" *:stroke-[2px]"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Moon size={24} strokeWidth={1.25} />
      ) : (
        <Sun size={24} strokeWidth={1.25} />
      )}
    </Button>
  );
};

export default ThemeToggle;
