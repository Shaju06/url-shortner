import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { cookies } from "next/headers";
import { SessionProvider } from "@/components/SessionProvider";
import { createSuperbaseServerClient } from "@/utils/superbase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Url Shortner",
  description: "Url Shortner by Varinder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSuperbaseServerClient();

  const user = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={user.data}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
