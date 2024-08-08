"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import Link from "next/link";

export const Appbar = () => {
  const session = useSession();
  return (
    <div className="py-4 px-20 flex justify-between items-center">
      <Link href="/">
        <div className="text-3xl font-bold text-gray-700">
          <span className="text-blue-400">W</span>aa
          <span className="text-blue-400">S</span>
        </div>
      </Link>
      <div>
        {session.data?.user ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onClick={() => signIn("google")}>Sign In</Button>
        )}
      </div>
    </div>
  );
};
