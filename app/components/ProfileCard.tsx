/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BiWallet } from "react-icons/bi";
import { MdCopyAll } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../api/hooks/useTokens";
import TokenList from "./TokenList";

const ProfileCard = ({ publicKey }: { publicKey: string }) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    <div className="text-xl font-semibold text-center">Loading...</div>;
  }

  if (session.status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="w-1/2 bg-white rounded-xl shadow-lg py-6 px-8">
        <Greeting
          name={session.data?.user?.name ?? ""}
          image={session.data?.user?.image ?? ""}
        />
        <Assets publicKey={publicKey} />
      </div>
    </div>
  );
};

export default ProfileCard;

const Assets = ({ publicKey }: { publicKey: string }) => {
  const [copied, setCopied] = useState(false);
  const { tokenBalances, loading } = useTokens(publicKey);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearInterval(timeout);
    }
  }, [copied]);

  if (loading) {
    return <div className="text-xl font-semibold text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col mt-8">
      <span className="text-slate-400 flex items-center font-medium">
        <BiWallet className="text-xl mr-2" /> Account assets
      </span>
      <div className="flex justify-between items-center mb-6 mt-2">
        <div className="text-5xl font-bold">${tokenBalances?.totalBalance?.toFixed(2)}<span className="text-slate-400 text-3xl ml-1">USD</span></div>
        <div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(publicKey);
              setCopied(true);
            }}
          >
            {copied ? (
              <div className="flex justify-between items-center">
                <FaRegSquareCheck className="mr-2 text-xl" />
                Address copied!
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <MdCopyAll className="mr-2 text-xl" /> Your Wallet Address
              </div>
            )}
          </Button>
        </div>
      </div>
      {tokenBalances?.tokens && <TokenList tokens={tokenBalances?.tokens}/>}
    </div>
  );
};

const Greeting = ({ name, image }: { name: string; image: string }) => {
  return (
    <div className="flex items-center">
      <img
        src={image}
        alt="User Image"
        className="size-14 rounded-full object-cover mr-4 border border-gray-400"
      />
      <h1 className="text-2xl font-semibold">Welcome back, {name}!</h1>
    </div>
  );
};
