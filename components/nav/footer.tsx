import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const items = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Privacy Policy",
      link: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      link: "/terms-conditions",
    },
    {
      name: "Cancellation & Refund Policy",
      link: "/cancellation-refund-policy",
    },
  ];
  return (
    <footer className="flex-1 relative w-full ">
      <div className="py-8 flex flex-col items-center justify-center">
        {items.map((item, index) => (
          <Link
            className="text-sm group flex items-center gap-2 mt-2"
            href={item.link}
            key={index}
          >
            {item.name}{" "}
            <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform ease-in-out duration-300" />
          </Link>
        ))}
      </div>
    </footer>
  );
}
