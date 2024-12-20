import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex-1 w-full min-h-screen">
      <div className="w-full max-w-4xl mx-auto text-center px-3 mt-24  ">
        <h1 className="text-center text-4xl font-semibold my-6 ">
          IMAGE-TEXT-GIF
          <span className="text-sm font-bold text-red-500 ml-2 align-top">
            BETA
          </span>
        </h1>

        <a
          className=" text-orange-700 dark:text-yellow-500"
          target="_blank"
          rel="noreferrer"
          href="https://mxnan.vercel.app/"
        >
          @mxnan
        </a>

        <Image
          src="/static/chillguy.gif"
          alt="hero"
          width={500}
          height={350}
          className="ring-2 my-6 ring-muted-foreground mx-auto rounded-xl"
        />
        <Link
          href="/create"
          className={cn(
            "",
            buttonVariants({
              variant: "default",
              className: "font-bold",
            })
          )}
        >
          Create now ?
        </Link>

        <div className="flex flex-col my-8 items-center justify-center">
          <div className="p-6 space-y-6">
            <p className="text-2xl font-bold text-orange-700 dark:text-yellow-500">
              WHY BUILD THIS ??
            </p>
            <p className="font-semibold">
              After seeing text-behind-image and how easy it is to insert text
              between image ,I created this with the sole intent of animating
              the text and creating a high quality GIF, Now you can create your
              GIF with just a few clicks.{" "}
            </p>
            <p className="font-semibold">
              There can be many use cases for this , you can use it any way you
              like . Any place you share an image and write some caption or text
              , you can just create a GIF with text animating in it .
            </p>
            <p className="font-semibold">
              Sharing all progress on X :{" "}
              <a
                href="https://x.com/mxnan_dev"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-orange-700 dark:text-yellow-500">
                  mxnan_dev
                </span>
              </a>
            </p>
          </div>
          <div className="relative w-full lg:max-w-3xl p-6 bg-muted border rounded-2xl shadow-md">
            <h2 className="text-xl text-orange-700 dark:text-yellow-500 font-semibold text-center mb-4">
              How to Create Your GIF
            </h2>
            <ul className="space-y-3 text-left ">
              <li>
                <strong className="text-orange-700 dark:text-yellow-500">
                  1. Upload Your Image:
                </strong>{" "}
                Choose an image from your device or use one from Unsplash.
              </li>
              <li>
                <strong className="text-orange-700 dark:text-yellow-500">
                  2. Add Text & Animations:
                </strong>{" "}
                Customize your GIF with text overlays and animations like fade ,
                slide, and more.
              </li>
              <li>
                <strong className="text-orange-700 dark:text-yellow-500">
                  3. Generate Your GIF:
                </strong>{" "}
                Click the &quot;Generate&quot; button and wait for the magic!
                Remember, the process may take a while depending on the
                complexity of animations.
              </li>
            </ul>
            {/* <div className="mt-6 border-t pt-4 bg-yellow-100 text-sm text-yellow-700 rounded-md">
              <p>
                <strong>Note:</strong> During GIF generation, your browser may
                become unresponsive. This is expected due to the processing
                involved. Please wait for the loader to finish.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
