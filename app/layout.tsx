import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/Appbar";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WaaS - Wallet as a Service",
  description: "Web3 Wallet as a Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="bg-blue-50 min-h-screen text-gray-700">
            <Appbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
