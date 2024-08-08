import { getServerSession } from "next-auth";
import ProfileCard from "../components/ProfileCard";
import db from "@/app/db";
import { authConfig } from "../lib/auth";

const getUserWallet = async () => {
  const session = await getServerSession(authConfig);

  const userWallet = await db.solWallet.findFirst({
    where: {
      userId: session?.user?.uid,
    },
    select: {
      publicKey: true,
      privateKey: false,
    },
  });

  if (!userWallet) {
    return {
      error: "No Solana wallet found associated for the user",
    };
  }

  return { userWallet, error: null };
};

export default async function Dashboard() {
  const userWallet = await getUserWallet();

  if (userWallet.error || !userWallet.userWallet?.publicKey) {
    return (
      <h1 className="text-xl font-semibold text-center">
        No Solana wallet found
      </h1>
    );
  }
  return (
    <div>
      <ProfileCard publicKey={userWallet.userWallet?.publicKey} />
    </div>
  );
}
