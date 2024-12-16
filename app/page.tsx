import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex-1 w-full ">
      <div className="w-full max-w-3xl text-center px-3 mt-24 mx-auto ">
        <h1 className="text-center  text-4xl font-extrabold my-6 mt-12">
          IMAGE-TEXT-GIF
        </h1>

        <Link
          href="/create"
          className={cn(
            "",
            buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xl font-bold ",
            })
          )}
        >
          Create now ?
        </Link>
        

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
