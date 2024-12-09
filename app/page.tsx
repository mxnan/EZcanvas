import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex-1 w-full ">
      <div className="w-full px-3 mt-24 mx-auto ">
        <h1 className="text-center  text-4xl font-extrabold my-6 mt-12">
          IMAGE-TEXT-GIF
        </h1>
        <div className="relative h-screen rounded-2xl border shadow-2xl overflow-hidden w-full">
          <Image
            src={"/static/hero.gif"}
            alt="hero"
            fill
            unoptimized
            quality={100}
            sizes="(100vw, 100vh)"
            className="h-full object-cover  w-full"
          />
          <Link
            href="/create"
            className={cn(
              "absolute z-10 bottom-24 left-1/2 -translate-x-1/2",
              buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xl font-bold ",
              })
            )}
          >
            Create now ?
          </Link>
          {/* <div className="absolute inset-0 backdrop-blur-[1px] bg-opacity-75" /> */}
        </div>
        <div className="flex mt-8 items-center justify-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum,
          dolorem distinctio quaerat, sit ut quas nemo commodi voluptate eveniet
          neque maxime veritatis voluptatem mollitia, est similique aspernatur
          officia perspiciatis porro at. Libero vitae reiciendis cum! Sunt sint
          temporibus aspernatur quaerat.
        </div>
      </div>
    </div>
  );
}
