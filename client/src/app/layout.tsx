import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import IsAuth from "@/components/IsAuth";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Url Shortner",
  description: "Url Shortner by Varinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <IsAuth>
          <main className="flex-1">{children}</main>
        </IsAuth>
        <Footer />
      </body>
    </html>
  );
}
