"use client";
import { Loader } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="relative w-full h-screen">
      <div className="relative h-full flex items-center justify-center overflow-hidden ">
      <Loader className="animate-spin" />
        {/* <Image
          src="/assets/car.gif"
          alt="logout"
          fill
          priority
          unoptimized
          className="object-cover z-0 h-1/2 w-1/2"
        />
        <div className="relative flex container mx-auto mt-40 2xl:mt-72 px-2   ">
          <div
            className="p-8 h-80 min-w-[350px] z-20 rounded-2xl
           text-center space-y-4
             bg-stone-950 text-gray-400"
          >
            <p className="text-sm">Logging</p>
            <p className="text-[2.5rem] font-medium">You</p>
            <p className="text-[3.5rem] font-extrabold">Out</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LogoutPage;
