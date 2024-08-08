"use client";

import { signIn, useSession } from "next-auth/react";
import { CTAButton } from "./Button";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="text-gray-700 flex flex-col items-center">
      <h1 className="font-bold text-6xl text-center">
        <span className="text-blue-400">Wallet</span> as a{" "}
        <span className="text-blue-400">Service</span>
      </h1>
      <h2 className="font-semibold text-2xl mt-4 mb-10 text-center">
        Create your crypto wallet and swap currencies
      </h2>

      {session.data?.user ? (
        <CTAButton onClick={() => router.push("/dashboard")}>Go to Dashboard</CTAButton>
      ) : (
        <CTAButton onClick={() => signIn("google")} />
      )}
    </div>
  );
};
