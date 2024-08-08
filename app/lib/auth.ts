import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session } from "next-auth";

export interface session extends Session {
  user: {
    name: string;
    email: string;
    image: string;
    uid: string;
  };
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    session: ({ session, token }: any): session => {
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.uid = token.uid ?? "";
      }

      return newSession!;
    },
    async jwt({ token, profile, account }: any) {
      const userExists = await db.user.findFirst({
        where: {
          sub: account?.providerAccountId ?? "",
        },
      });

      if (userExists) {
        token.uid = userExists.id;
      }

      return token;
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === "google") {
        const { email, name, image } = user;

        if (!email) {
          return false;
        }

        const userExists = await db.user.findFirst({
          where: {
            username: email,
          },
        });

        if (userExists) {
          return true;
        }

        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = keypair.secretKey.toString();

        await db.user.create({
          data: {
            username: email,
            name,
            profilePicture: image,
            provider: "Google",
            sub: account.providerAccountId,
            solWallet: {
              create: {
                publicKey,
                privateKey,
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        });

        return true;
      }

      return false;
    },
  },
};
